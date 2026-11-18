#!/usr/bin/env python3
"""Sustituye el pago simulado de la tirada completa por el cobro real con Stripe (ver /api/pagar y /api/desbloquear en server.js).
Uso: python3 tools/parche_pago_stripe.py public/app.js"""
import sys
p = sys.argv[1]; s = open(p).read()
if 'pintarTirada' in s: sys.exit('ya aplicado')
a = s.index("async function echarCompleta(q) {"); b = s.index("$('#tipos').addEventListener('click'")
nuevo = open(p.replace('app.js', '') + '../tools/tirada_pago.js').read()
s = s[:a] + nuevo + s[b:]
old = "alVer($('#tapete').parentElement, () => echarCompleta($('#formCompleta').q.value), .2);"
assert old in s
s = s.replace(old, "if (PAGO) { $('#completa').scrollIntoView(); volverDelPago().then(ok => ok || echarCompleta($('#formCompleta').q.value)); }\nelse alVer($('#tapete').parentElement, () => echarCompleta($('#formCompleta').q.value), .2);")
open(p, 'w').write(s); print('ok')
