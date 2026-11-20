# Actualiza en data/demo.json solo lo que cambia cada día (luna de hoy, calendario lunar del mes, próximas fases
# y carta del día) y apunta la fecha, que la vista previa enseña en su aviso. Lo demás (cartas, años chinos,
# cartas astrales de ejemplo) no cambia y no se vuelve a pedir.
# Uso: python3 tools/refrescar_hoy.py [AAAA-MM-DD]   (por defecto, hoy en Madrid)
import datetime, json, os, subprocess, sys, time
from zoneinfo import ZoneInfo
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = 'https://roxyapi.com/api/v2'

def get(path, body=None, n=0):
    cmd = ['curl', '-s', '-m', '30']
    if body is not None: cmd += ['-X', 'POST', '-H', 'Content-Type: application/json', '-d', json.dumps(body)]
    out = subprocess.run(cmd + [R + path], capture_output=True).stdout
    try:
        j = json.loads(out)
    except Exception:
        if n >= 3: raise SystemExit(f'Fallo en {path}: {out[:200]!r}')
        time.sleep(2 * (n + 1)); return get(path, body, n + 1)
    if isinstance(j, dict) and j.get('error'): raise SystemExit(f'Error de RoxyAPI en {path}: {j.get("error")}')
    return j

hoy = datetime.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else datetime.datetime.now(ZoneInfo('Europe/Madrid')).date()
ruta = os.path.join(BASE, 'data', 'demo.json')
D = json.load(open(ruta))
D['lunaHoy'] = get(f'/astrology/moon-phase/current?lang=es&timezone=Europe/Madrid&date={hoy.isoformat()}')
D['lunaMes'] = get(f'/astrology/moon-phase/calendar/{hoy.year}/{hoy.month}?lang=es&timezone=Europe/Madrid')
D['lunaProx'] = get('/astrology/moon-phase/upcoming?lang=es&timezone=Europe/Madrid')
D['cartaDia'] = get('/tarot/daily?lang=es', {'date': hoy.isoformat()})
D['fecha'] = hoy.isoformat()
for k in ('bio', 'numeros'): D.pop(k, None)   # numerología y biorritmo retirados de la web
json.dump(D, open(ruta, 'w'), ensure_ascii=False)
print('ok', hoy.isoformat(), '| luna:', D['lunaHoy'].get('phase'), round(D['lunaHoy'].get('illumination', 0)), '% | carta del día:', D['cartaDia'].get('card', {}).get('name'))
