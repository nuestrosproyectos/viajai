# Muro de pago en la tirada completa: 3 cartas gratis, el resto boca abajo y desenfocado.
import os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(B, *a)
j = open(P('public', 'app.js'), encoding='utf8').read()

a = "    for (let i = 0; i < cartas.length; i++) { cartas[i].classList.add('girada'); items[i].classList.add('vista'); await espera(260); }"
b = """    const GRATIS = 3;
    for (let i = 0; i < cartas.length; i++) {
      if (i < GRATIS) { cartas[i].classList.add('girada'); items[i].classList.add('vista'); await espera(260); }
      else { cartas[i].classList.add('bloqueada'); items[i].classList.add('vista', 'borrosa'); items[i].setAttribute('aria-hidden', 'true'); }
    }"""
assert a in j; j = j.replace(a, b, 1)

a = "    res.hidden = false;"
b = """    const precio = $('#tipos [aria-selected=true] i').textContent, faltan = cartas.length - GRATIS;
    const ultima = T.pos[T.pos.length - 1][0];
    const muro = document.createElement('div'); muro.className = 'muro';
    muro.innerHTML = `<p class="muro-t">Te faltan ${faltan} cartas, incluida la de <em>«${esc(ultima)}»</em>.</p><p>Las cartas ya están echadas: son estas y no cambian. Desbloquéalas para ver qué dicen y lo que veo en tu tirada completa.</p><button type="button" class="btn btn-pri" id="desbloquear">Ver mi tirada completa · ${esc(precio)}</button><small>Pago seguro con tarjeta o Bizum. En esta vista previa el pago es simulado.</small>`;
    lec.appendChild(muro);
    $('#desbloquear').addEventListener('click', async () => {
      const bt = $('#desbloquear'); bt.disabled = true; bt.textContent = 'Procesando el pago…';
      await espera(900);
      muro.remove();
      for (let i = GRATIS; i < cartas.length; i++) { cartas[i].classList.remove('bloqueada'); cartas[i].classList.add('girada'); items[i].classList.remove('borrosa'); items[i].removeAttribute('aria-hidden'); await espera(260); }
      res.hidden = false; res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });"""
assert a in j; j = j.replace(a, b, 1)
j = j.replace("Aquí la ves completa como vista previa.", "Gracias por tu consulta.")
open(P('public', 'app.js'), 'w', encoding='utf8').write(j)

c = open(P('public', 'estilo.css'), encoding='utf8').read()
if '.muro{' not in c:
    c += """
/* Muro de pago de la tirada completa */
.lectura li.borrosa div{filter:blur(6px);user-select:none;pointer-events:none}
.lectura li.borrosa .n{opacity:.4}
.naipe-c.bloqueada .dorso::after{content:"";position:absolute;left:50%;top:50%;width:26%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:rgba(236,228,214,.92) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23141010' stroke-width='2'%3E%3Crect x='5' y='11' width='14' height='10' rx='1'/%3E%3Cpath d='M8 11V8a4 4 0 0 1 8 0v3'/%3E%3C/svg%3E") center/58% no-repeat;box-shadow:0 4px 12px rgba(0,0,0,.5)}
.muro{position:relative;margin-top:-140px;padding:150px 4px 6px;background:linear-gradient(180deg,rgba(16,12,11,0) 0%,var(--negro) 42%);text-align:left}
.muro-t{font:400 clamp(24px,2.4vw,30px)/1.2 var(--titulo);margin-bottom:10px}.muro-t em{font-style:italic}
.muro p{color:var(--gris2);font-size:15.5px;max-width:52ch}
.muro .btn{margin-top:20px}.muro small{display:block;margin-top:12px;font-size:13px;color:var(--gris)}
"""
open(P('public', 'estilo.css'), 'w', encoding='utf8').write(c)
print('ok')
