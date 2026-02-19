# Template: Requerimento a Órgão Público

---

**Ao(À) {{orgao_destinatario}}**
**Att: {{setor_departamento}}**

---

**REQUERENTE:**
- Nome/Razão Social: {{requerente_nome}}
- CNPJ/CPF: {{requerente_cpf_cnpj}}
- Endereço: {{requerente_endereco}}
- Telefone: {{requerente_telefone}}
- E-mail: {{requerente_email}}

---

## OBJETO DO REQUERIMENTO

{{objeto_resumo}}

---

## FUNDAMENTAÇÃO

{{fundamentacao_detalhada}}

---

## PEDIDO

Diante do exposto, requer a Vossa Senhoria:

{{#each pedidos}}
{{index}}. {{descricao}}
{{/each}}

---

## DOCUMENTOS ANEXOS

{{#each documentos}}
- {{nome_documento}}
{{/each}}

---

Termos em que,
Pede deferimento.

**{{cidade}}, {{data_extenso}}**

---

_______________________________________
{{requerente_nome}}
{{#if requerente_cnpj}}
CNPJ: {{requerente_cnpj}}
{{else}}
CPF: {{requerente_cpf}}
{{/if}}
