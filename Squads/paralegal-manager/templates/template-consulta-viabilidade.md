# Template: Consulta de Viabilidade (Junta Comercial)

---

**À JUNTA COMERCIAL DO ESTADO DE {{estado_sigla}}**
**Protocolo de Viabilidade**

---

## DADOS DO SOLICITANTE

**Sócio 1:**
- Nome: {{socio1_nome_completo}}
- CPF: {{socio1_cpf}}
- RG: {{socio1_rg}}

**Sócio 2:**
- Nome: {{socio2_nome_completo}}
- CPF: {{socio2_cpf}}
- RG: {{socio2_rg}}

---

## CONSULTA DE NOME EMPRESARIAL

**1ª Opção:** {{nome_opcao_1}}
**2ª Opção:** {{nome_opcao_2}}
**3ª Opção:** {{nome_opcao_3}}

---

## ENDEREÇO SEDE

**Endereço:** {{endereco_completo}}
**Bairro:** {{bairro}}
**Cidade:** {{cidade}} - {{estado_sigla}}
**CEP:** {{cep}}

---

## OBJETO SOCIAL

{{objeto_social_detalhado}}

---

## CNAEs PRINCIPAIS

{{#each cnaes}}
- {{codigo}}: {{descricao}}
{{/each}}

---

## CAPITAL SOCIAL INICIAL

**Valor:** R$ {{capital_social}} ({{capital_social_extenso}})

---

## TIPO SOCIETÁRIO

{{tipo_societario}}

---

**Data:** {{data_extenso}}

---

_______________________________________
{{socio1_nome_completo}}
CPF: {{socio1_cpf}}

_______________________________________
{{socio2_nome_completo}}
CPF: {{socio2_cpf}}
