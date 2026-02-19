# Template: Procuração

---

# PROCURAÇÃO

**OUTORGANTE:**
- Nome: {{outorgante_nome_completo}}
- Nacionalidade: {{outorgante_nacionalidade}}
- Estado Civil: {{outorgante_estado_civil}}
- Profissão: {{outorgante_profissao}}
- RG: {{outorgante_rg}} - {{outorgante_rg_orgao}}
- CPF: {{outorgante_cpf}}
- Endereço: {{outorgante_endereco_completo}}

**OUTORGADO:**
- Nome: {{outorgado_nome_completo}}
- Nacionalidade: {{outorgado_nacionalidade}}
- Estado Civil: {{outorgado_estado_civil}}
- Profissão: {{outorgado_profissao}}
- RG: {{outorgado_rg}} - {{outorgado_rg_orgao}}
- CPF: {{outorgado_cpf}}
- Endereço: {{outorgado_endereco_completo}}

---

## PODERES CONFERIDOS:

Pelo presente instrumento particular de procuração, o(a) OUTORGANTE nomeia e constitui seu(sua) bastante Procurador(a) o(a) OUTORGADO(A), a quem confere amplos poderes para:

{{#if poderes_especificos}}
{{poderes_especificos}}
{{else}}
a) Representar o(a) outorgante perante órgãos públicos e privados;
b) Assinar documentos, requerimentos, contratos e escrituras;
c) Protocolar e acompanhar processos administrativos;
d) Receber notificações e intimações;
e) Prestar declarações e informações em nome do(a) outorgante;
f) Praticar todos os atos necessários ao fiel cumprimento deste mandato.
{{/if}}

---

## PRAZO DE VALIDADE:

{{#if prazo_determinado}}
Esta procuração tem validade até {{data_validade}}.
{{else}}
Esta procuração tem prazo indeterminado, podendo ser revogada a qualquer tempo mediante notificação expressa.
{{/if}}

---

**Local e Data:** {{cidade}}, {{data_extenso}}

---

_______________________________________
{{outorgante_nome_completo}}
CPF: {{outorgante_cpf}}
(OUTORGANTE)

---

**TESTEMUNHAS:**

_______________________________________
Nome: ___________________________
CPF: ____________________________

_______________________________________
Nome: ___________________________
CPF: ____________________________
