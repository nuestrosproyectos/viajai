import os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
j = open(os.path.join(B, 'public', 'app.js'), encoding='utf8').read()
a = "    natal: async ({ preset }) =>"
b = """    tirada: async ({ tipo, question }) => {
      const n = { celtic: 10, love: 5, career: 7 }[tipo];
      return { question, positions: sacar(n).map((id, i) => { const c = porId[id]; const inv = Math.random() < .3; const L = lado(c, inv); return { position: i + 1, card: { id, name: c.name, arcana: c.arcana, suit: c.suit, reversed: inv, keywords: L.keywords, meaning: L.description, love: L.love, career: L.career, finances: L.finances } }; }) };
    },
"""
assert a in j and 'tirada: async' not in j
j = j.replace(a, b + a, 1)
p = open(os.path.join(B, 'tools', 'parche_completa.js'), encoding='utf8').read()
a = "/* ---------- VII · Número y biorritmo ---------- */"
assert a in j
j = j.replace(a, p + a, 1)
open(os.path.join(B, 'public', 'app.js'), 'w', encoding='utf8').write(j)
print('ok')
