# Fontes consultadas — Vibration API

- Acesso: 2026-08-28.
- MDN, `Navigator.vibrate()`: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate — disponibilidade limitada; aceita duração ou padrão temporal, retorna booleano e exige ativação do usuário.
- W3C, `Vibration API` (CRD 2026-05-21): https://www.w3.org/TR/vibration/ — a API usa `VibratePattern`; com documento não visível o algoritmo retorna `false`; não define controle de amplitude/força física.
- Impacto: esta fatia solicita somente padrões temporais locais, detecta API ausente/recusa sem interromper o timer e não promete percepção tátil em todos os dispositivos.
