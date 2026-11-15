# Descarga datos reales de RoxyAPI para la demo estática y las imágenes de cartas.
import json, subprocess, concurrent.futures as cf, datetime, os, sys
R='https://roxyapi.com/api/v2'
import time
def get(path, body=None, n=0):
    cmd=['curl','-s']
    if body is not None: cmd+=['-X','POST','-H','Content-Type: application/json','-d',json.dumps(body)]
    cmd.append(R+path)
    out=subprocess.run(cmd,capture_output=True).stdout
    try:
        j=json.loads(out)
        if isinstance(j,dict) and j.get('code','').startswith('rate_limit'):
            time.sleep(8); return get(path,body,n)
        return j
    except Exception:
        if n>=4: raise RuntimeError(path+' '+out[:200].decode('utf8','replace'))
        time.sleep(1.5*(n+1)); return get(path,body,n+1)
D={}
# Tarot: 78 cartas
ids=[]
off=0
while True:
    r=get(f'/tarot/cards?lang=es&limit=100&offset={off}'); ids+= [c['id'] for c in r['cards']]
    off+=len(r['cards'])
    if off>=r['total'] or not r['cards']: break
print('cartas',len(ids))
with cf.ThreadPoolExecutor(4) as ex: cards=list(ex.map(lambda i:get(f'/tarot/cards/{i}?lang=es'),ids))
D['cards']=cards
# Animales chinos + compatibilidades
an=get('/chinese-astrology/zodiac/animals?lang=es')['animals']; D['animals']=an
pairs=[(a['id'],b['id']) for i,a in enumerate(an) for b in an[i:]]
with cf.ThreadPoolExecutor(4) as ex: comps=list(ex.map(lambda p:get(f'/chinese-astrology/zodiac/compatibility/{p[0]}/{p[1]}?lang=es'),pairs))
D['chinoComp']={f'{p[0]}|{p[1]}':{k:c.get(k) for k in ('relationship','relationshipNameLocalized','relationshipChinese','score','verdict','summary')} for p,c in zip(pairs,comps)}
# Año nuevo chino 1930-2030 por búsqueda binaria con zodiac/sign
def animal(d): return get('/chinese-astrology/zodiac/sign?lang=es',{'date':d})['animal']['id']
def cny(y):
    lo=datetime.date(y,1,19); hi=datetime.date(y,2,21)
    a_hi=animal(hi.isoformat())
    while (hi-lo).days>1:
        mid=lo+(hi-lo)//2
        if animal(mid.isoformat())==a_hi: hi=mid
        else: lo=mid
    return y,hi.isoformat(),a_hi
with cf.ThreadPoolExecutor(4) as ex: D['cny']={y:[d,a] for y,d,a in ex.map(cny,range(1930,2031))}
# Elemento del año
with cf.ThreadPoolExecutor(4) as ex: els=list(ex.map(lambda y:(y,get('/chinese-astrology/zodiac/sign?lang=es',{'date':f'{y}-06-01'})),range(1930,2031)))
D['yearEl']={y:[r['elementLocalized'],r['interpretation']] for y,r in els}
# Numerología
with cf.ThreadPoolExecutor(6) as ex: nm=list(ex.map(lambda n:(n,get(f'/numerology/meanings/{n}?lang=es')),[1,2,3,4,5,6,7,8,9,11,22,33]))
D['numeros']=dict(nm)
# Luna
hoy=datetime.date(2026,11,15)
D['lunaHoy']=get('/astrology/moon-phase/current?lang=es&timezone=Europe/Madrid&date='+hoy.isoformat())
D['lunaMes']=get('/astrology/moon-phase/calendar/2026/11?lang=es&timezone=Europe/Madrid')
D['lunaProx']=get('/astrology/moon-phase/upcoming?lang=es&timezone=Europe/Madrid')
D['cartaDia']=get('/tarot/daily?lang=es',{'date':hoy.isoformat()})
# Ejemplos para carta astral y compatibilidad
P={'ana':{'date':'1985-03-21','time':'09:30:00','latitude':37.1882,'longitude':-3.6067,'timezone':'Europe/Madrid'},
   'marcos':{'date':'1988-11-02','time':'18:15:00','latitude':40.4168,'longitude':-3.7038,'timezone':'Europe/Madrid'},
   'lucia':{'date':'1993-07-08','time':'23:40:00','latitude':41.3874,'longitude':2.1686,'timezone':'Europe/Madrid'}}
D['personas']=P
D['natal']={k:get('/astrology/natal-chart?lang=es',v) for k,v in P.items()}
D['compat']={'ana|marcos':get('/astrology/compatibility-score?lang=es',{'person1':P['ana'],'person2':P['marcos']}),
             'lucia|marcos':get('/astrology/compatibility-score?lang=es',{'person1':P['lucia'],'person2':P['marcos']})}
D['bio']={k:get('/biorhythm/reading?lang=es',{'birthDate':v['date'],'targetDate':hoy.isoformat()}) for k,v in P.items()}
json.dump(D,open('data/demo.json','w'),ensure_ascii=False)
print('ok',os.path.getsize('data/demo.json'))
