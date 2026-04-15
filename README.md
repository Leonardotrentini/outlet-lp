# outlet-lp

Landing pages estáticas WK Outlet (grupos e vendedores), prontas para [Vercel](https://vercel.com).

## URLs no ar (use estas nos anúncios)

| Página | URL |
|--------|-----|
| Grupo VIP | `https://SEU-DOMINIO/grupos` |
| Catálogo / vendedores (rotator WhatsApp) | `https://SEU-DOMINIO/vendedores` |

A raiz `/` redireciona para `/grupos`. Os ficheiros `.html` originais continuam acessíveis pelos nomes (`/lp-outletgrupos.html`, `/lpoutletvendedores2.html`).

## Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório [Leonardotrentini/outlet-lp](https://github.com/Leonardotrentini/outlet-lp).
2. **Framework Preset:** Other (ou “Sem framework”).
3. **Build Command:** deixe em branco.
4. **Output Directory:** deixe em branco (raiz do projeto).
5. **Install Command:** deixe em branco (não há dependências npm obrigatórias).
6. Clique em **Deploy**.

O `vercel.json` define redirects, rewrites (`/grupos`, `/vendedores`), cabeçalhos de segurança e `Content-Type` para assets sem extensão correta.

## Testar no computador

```bash
cd Desktop/lp-outlet
npx vercel dev
```

Ou só ficheiros estáticos (sem rewrites): `python -m http.server 8889` e abra os `.html` pelos nomes.

## Alterar links de WhatsApp

- **Grupos:** link do botão em `lp-outletgrupos.html`.
- **Vendedores:** array `whatsappLinks` no script no final de `lpoutletvendedores2.html`.

## Mudar a página padrão da raiz

Em `vercel.json`, altere o `destination` do redirect de `/` (hoje `/grupos`) para `/vendedores` se preferir.
