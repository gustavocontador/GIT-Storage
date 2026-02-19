# Template: Alteração Contratual

## INSTRUÇÃO PARA IA:
Template para alterações: entrada/saída sócios, mudança endereço, capital, CNAEs.

---

# ALTERAÇÃO CONTRATUAL
## {{nome_empresa}}

### IDENTIFICAÇÃO DA SOCIEDADE

**Empresa:** {{nome_empresa}}
**CNPJ:** {{cnpj}}
**NIRE:** {{nire}}
**Sede:** {{endereco_atual}}

---

### SÓCIOS:

{{#each socios}}
**SÓCIO {{index}}:**
- Nome: {{nome_completo}}
- CPF: {{cpf}}
- RG: {{rg}}
- Endereço: {{endereco}}
{{/each}}

---

### CLÁUSULA ALTERADA: {{clausula_numero}} - {{clausula_nome}}

**TEXTO ANTERIOR:**
{{texto_anterior}}

**NOVO TEXTO:**
{{texto_novo}}

---

### FUNDAMENTAÇÃO:

Os sócios resolvem, por unanimidade, alterar o contrato social conforme segue:

{{fundamentacao_detalhada}}

---

### CONSOLIDAÇÃO DO CONTRATO SOCIAL

O contrato social passa a vigorar com a seguinte redação consolidada:

{{contrato_social_consolidado}}

---

**Local e Data:** {{cidade}}, {{data_extenso}}

---

**SÓCIOS:**

{{#each socios}}
_______________________________________
{{nome_completo}}
CPF: {{cpf}}

{{/each}}
