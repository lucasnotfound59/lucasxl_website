# SOCRATES content sources

## Source boundary

- Local source root: `/Users/xinlu/Desktop/EAI Project`
- Public website content uses project-level aggregate results only. It does not disclose raw participant records, participant-level results, or credentials.
- Numerical claims were checked against `README.md` and `experiment/results/analysis/stats_digest.md`. Aggregate CSV outputs were used to resolve the ceiling-chart inconsistency described below.
- `papers/Final_Paper_EN.docx` contains unfinished abstract and reference placeholders. It is not treated as a verified final paper or as numerical authority.

## Figure provenance

The copied website files are byte-identical to these existing source PNGs:

| Original | Public file | SHA-256 |
| --- | --- | --- |
| `experiment/results/figures/c_accuracy_by_type.png` | `public/images/socrates/c_accuracy_by_type.png` | `ed9950099b826f8d0b1839f6ff2afa5a5fa4fe57785fd6237f69474096f2d3ac` |
| `experiment/results/figures/c_mratio.png` | `public/images/socrates/c_mratio.png` | `2f738942e52abfe60e281800898433bf5603207a0177e1db983745bf2222cf11` |
| `experiment/results/figures/c_hallucination_acc.png` | `public/images/socrates/c_hallucination_acc.png` | `99408479fc0428c04a0b9b76f2be69f90a3b44dd8b775abcafa578d31364ff92` |
| `experiment/poster_figs/c_errors_ceiling.png` | `public/images/socrates/c_errors_ceiling.png` | `c17cd869e3e78cf021c2496ea79377ff4453a4e7b8201e676d78f0c1d08f6a80` |

The initially specified `experiment/results/figures/c_errors_ceiling.png` was stale: it placed `local-qwen3-4b` below the 30-error threshold, while the aggregate group summary and M-ratio outputs record 35 errors. With user approval, the existing higher-resolution `experiment/poster_figs/c_errors_ceiling.png` was copied instead. It shows the aggregate-consistent 35-error classification and was not regenerated or edited.

## Numerical and interpretive caveats

- The study used 400 True/False questions, four equal item categories, four stochastic model samples per question, 46 human participants, 1,647 valid human answers, and 20 model configurations.
- Humans answered Chinese items and models answered English items. Language is therefore confounded with group.
- Human overall accuracy was 73.5%. Human accuracy was 50.9% on the full hallucination category and 26.9% on its fictional-only subset; those denominators must not be conflated.
- M-ratio is reported as a behavioral confidence-tracking measure. It does not establish an internal metacognitive faculty.
- Human M-ratio was 1.37 with a 95% clustered-bootstrap interval of [1.205, 1.543]. The four data-driven model estimates shown in the M-ratio figure ranged from 0.31 to 0.69.
- Near-ceiling groups made too few errors for strong inference: at least 30 errors are data-driven, 10–29 are regularized, and fewer than 10 are prior-dominated. A fitted value near one in an error-poor group is not evidence of strong metacognition.
- The human sample is small, mostly students, and drawn from one Chinese-speaking population. All conclusions remain behavioral.

## Future plans supplied for the public page

1. Investigate when AI systems produce unsupported answers and how stated confidence relates to errors.
2. Explore an answer-first, explanation-second experiment. Explanation scoring remains to be designed, and fluency alone does not establish understanding.
3. Aim to participate in a hackathon at Stanford, build alongside others, and meet people with shared interests. This is a future goal, not a confirmed event, admission, or affiliation.
