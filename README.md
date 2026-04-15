# outlet-lp

Landing pages estáticas WK Outlet (grupos e vendedores), prontas para [Vercel](https://vercel.com).

## URLs no ar

| Uso | Caminho |
|-----|---------|
| Raiz do site | `/` → `index.html` |
| Campanha grupos | `/grupos` |
| Campanha vendedores (rotator WhatsApp) | `/vendedores` |
| Arquivos diretos | `/lp-outletgrupos.html`, `/lpoutletvendedores2.html` |

## Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório [Leonardotrentini/outlet-lp](https://github.com/Leonardotrentini/outlet-lp).
2. **Framework Preset:** Other (ou “Sem framework”).
3. **Build Command:** deixe em branco.
4. **Output Directory:** deixe em branco (raiz do projeto).
5. **Install Command:** deixe em branco (não há dependências npm obrigatórias).
6. Clique em **Deploy**.

O ficheiro `vercel.json` define rewrites (`/grupos`, `/vendedores`), cabeçalhos de segurança e `Content-Type` correto para os assets sem extensão (CSS e scripts guardados pelo “Save as” do browser).

## Testar no computador

```bash
cd Desktop/lp-outlet
python -m http.server 8889
```

Abra: `http://127.0.0.1:8889/` (o servidor Python não aplica `vercel.json`; use `npx vercel dev` para espelhar a Vercel).

## Alterar links de WhatsApp

- **Grupos:** link do botão em `lp-outletgrupos.html`.
- **Vendedores:** array `whatsappLinks` no script no final de `lpoutletvendedores2.html`.
