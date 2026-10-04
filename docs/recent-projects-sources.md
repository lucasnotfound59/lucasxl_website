# Recent portfolio update: sources and disclosure boundaries

Checked 2026-10-04 (America/Los_Angeles). This note records the authoring sources; it does not publish private source documents.

The owner confirmed VisitSmoothie October 2026 and Action Chunking September 2026–present, and confirmed collaborative development across VisitSmoothie's modules.

## SOCRATES

Owner explicitly authorized reading `/Users/xinlu/Desktop/EAI Project`. The authoritative abstract is in `paper_revision_zh_replication/Lu Xin_SOCRATES Testing Behavioral Confidence Calibration.md`, updated September 20. The other two English paper Markdown files in that folder have the same abstract.

The revised study describes 46 Chinese-speaking humans, 1,647 valid responses, a 400-item bank, 19 English-prompted model configurations and six Chinese-prompted local open-weight configurations (9,600 attempts; 9,597 valid responses). Human ECE .086; paired clustered-bootstrap comparison higher than 17/19 English configurations. Chinese-cohort mean model accuracy .954 and ECE .053 versus human .735 and .086; Qwen3 1.7B Q8_0 ECE .101. Human MLE M-ratio 1.370; data-driven model ranges .310–.690 English and .152–.458 Chinese. Fictional versus real-obscure human d-prime .001, Chinese models 1.58–5.24. All conclusions are behavioral; the Chinese cohort matches task language but backend/model/sampling differences preclude causal language claims.

Existing four website plots belong to the original analysis and were vetted in the earlier source note `docs/socrates-content-sources.md`. They are not replacement plots for the September Chinese cohort; explicitly label this distinction, and do not silently reinterpret chart values.

## VisitSmoothie / 医伴

Named repository: https://github.com/lucasnotfound59/TriMedManagement (private).
Read through authenticated GitHub API: `README.md` and `docs/交接说明.md`, main, October 4 snapshot.

Owner statement: jointly developed with friends; involved across all modules. Do not assign sole authorship or claim personally implemented a named colleague's account/security module.

The owner's original request identifies this as the product built during the Stanford Venture Trip hackathon. Use this personal event context in both languages without inferring university affiliation, sponsorship or awards.

The owner supplied `Screenshot 2026-10-04 at 14.17.59.png` as VisitSmoothie material. The unchanged PNG is stored at `public/images/photos/visit-smoothie-welcome.png` and used for its timeline cover and detail-page image. It depicts the Chinese welcome screen, not patient data or clinical-outcome evidence; bilingual alternative descriptions identify the interface.

README calls it 医伴 · 患者版（VisitSmoothie）. It records/organizes symptoms for clinicians and organizes post-visit instructions. Main integrates the patient app, mobile UI, body-map intake, Clinical Plan follow-up, provider selection, onboarding, encrypted server-side SQLite storage, account and transcription modules. Node24 / Next.js local prototype. Pages include welcome, onboarding, login, pre, post, doctor, report and settings. AI uses server-side provider calls with rule fallback; no configured key means photo/transcription unavailable. The source specifies no diagnosis or dose-setting and patient confirmation; risky situations route toward medical care. Fixed EN/ZH UI exists, but AI-generated/rule text remains primarily Chinese.

It is not deployed for real patient use. Real long recordings, real photo inputs and notification permission have not undergone human trials; synthetic patients and engineering checks are not clinical validation. Reminders depend on app/browser availability. Public deployment, HTTPS, operational key management, medical review and further privacy safeguards remain work. Do not copy credentials, security incident specifics, patient records or internal teammate identifiers. A GitHub link, if included, must explicitly say private repository / collaborator access.

## Action Chunking under Low Data

Named repository: https://github.com/lucasnotfound59/action-chunking-low-data (private; no root README).
Read through authenticated GitHub API: `实验设计.md` v0.3 September22, `docs/runs/2026-09-23-stage0-validation.md`, `docs/runs/2026-09-23-drake-smoke.md`, `results/stage0/baseline50-paired-summary.json`.

Working title: Observation Memory or Prediction Memory under Hidden Delay? Core compares observation history with controller-level temporal aggregation of overlapping action predictions under limited demonstrations and hidden FIFO command-application delay. Main protocol holds executed prefix E=1 and prediction horizon H=16; C history, W aggregation window, N demonstrations, D hidden delay. Do not conflate generation evaluations NFE, executed prefix E, or hidden command delay D. Hypotheses are not results. Main uses image-based Diffusion Policy and Drake Push-T; DBP and controlled ACT-CVAE/ACT-no-VAE/Drifting-ACT are proposed/gated comparisons, not completed findings.

Current GitHub evidence: upstream training/evaluation integration, paired scenario manifests, nested subsets N25/50/100/180, history/aggregation/FIFO controller tests and audit logging. The Stage0 record reports 47 local tests and two byte-identical two-rollout reproducibility runs. Formal upstream-reference final/best EMA evaluation: 41/50 (82%) versus 38/50 (76%), same 50 scenarios and sampling seeds, one training seed; baseline C2/rawH16 contains 15 future actions, E8, not the main H16/E1 experiment. Do not describe this as a memory-type improvement, multi-seed conclusion, or new method outperforming the baseline. Full mechanism study is unfinished.

Historical cross-conversation memory records further TeamA training and a paused incomplete pilot. Those notes are context only, not a current complete-result source. Prefer a conservative in-progress description without historical pilot success rates until a fresh complete results source is provided.
