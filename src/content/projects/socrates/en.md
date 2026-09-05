---
title: "Project SOCRATES"
summary: "Comparing human and language-model confidence: calibration, uncertainty, and the limits of behavioral evidence."
coverAlt: "Illustration for Project SOCRATES"
---

## Research Question

Does confidence track correctness in the same way for humans and language models? Project SOCRATES asks this question with a shared True/False task and a shared confidence scale. The goal is not only to ask which group is more accurate, but whether confidence rises and falls with correctness. Reliable AI should communicate uncertainty: an answer that sounds certain when it is wrong can be more harmful than an openly tentative one.

## Why It Matters

Accuracy, calibration, and understanding are different. A system can score highly while giving nearly identical confidence to correct and incorrect answers; it can also be well calibrated in aggregate without knowing why an individual answer is right. SOCRATES therefore treats reported confidence as behavioral evidence. It does not claim that model confidence reveals an internal faculty equivalent to human metacognition.

## My Role and Research Process

This was my independent research project. I developed it through a workflow of question-bank design, human questionnaires and model evaluation, aggregate analysis, and research communication. This page focuses on verified project-level findings and does not publish participant records or claim sole authorship of every technical component in the pipeline.

## Study Design

The bilingual bank contained 400 True/False questions: 100 ordinary-knowledge items, 100 disciplinary items, 100 plausible-sounding pseudoscientific traps, and 100 hallucination items mixing fictional entities with real but obscure ones. After each answer, humans and models used the same five-level retrospective confidence format. Each model received four stochastic samples per question. The aggregate dataset covers 46 humans, 1,647 valid answers, and 20 model configurations. Humans answered in Chinese, while models answered in English—a central confound in any comparison.

## Findings and Evidence

Human overall accuracy was 73.5%, while most model configurations scored 97–100%. Across the full 100-item hallucination category, human accuracy was 50.9%. These are first-order accuracy results, not measures of how well confidence tracked errors.

<figure class="research-figure">
  <a href="/images/socrates/c_accuracy_by_type.png"><img src="/images/socrates/c_accuracy_by_type.png" width="958" height="633" alt="Accuracy comparison for humans and language models across ordinary, disciplinary, trap, and hallucination question types" loading="lazy" decoding="async" /></a>
  <figcaption>Accuracy across all four categories. Humans answered Chinese questions and models answered English questions, so the language asymmetry limits direct comparison. Click the figure to open it at full resolution.</figcaption>
</figure>

M-ratio (`meta-d′/d′`) measures behaviorally how well confidence separates correct from incorrect answers relative to first-order discrimination. The human estimate was 1.37, with a 95% clustered-bootstrap interval of [1.205, 1.543]. The four error-rich, data-driven model estimates ranged from 0.31 to 0.69. The figure's legacy label “metacognitive efficiency” is behavioral shorthand; it should not be read as evidence of an internal faculty.

<figure class="research-figure">
  <a href="/images/socrates/c_mratio.png"><img src="/images/socrates/c_mratio.png" width="1022" height="581" alt="M-ratio estimates and clustered-bootstrap intervals for humans and four error-rich model groups" loading="lazy" decoding="async" /></a>
  <figcaption>M-ratio for the human group and only the four model groups with enough errors for data-driven estimates. The intervals describe uncertainty in behavioral estimates, not internal metacognition. Click the figure to open it at full resolution.</figcaption>
</figure>

Within the fictional-only subset of the hallucination category, humans scored 26.9%, while model configurations scored 85–100%. Humans lowered their confidence but often affirmed fictional claims. Aggregate signal-detection analysis indicates an affirmative response bias with near-zero discrimination between fictional and real-obscure items. It does not show negative discrimination or an absence of internal metacognition.

<figure class="research-figure">
  <a href="/images/socrates/c_hallucination_acc.png"><img src="/images/socrates/c_hallucination_acc.png" width="1153" height="633" alt="Accuracy on the fictional-only subset for humans and model configurations" loading="lazy" decoding="async" /></a>
  <figcaption>Accuracy on the fictional-only subset, not the complete hallucination category. Humans scored 26.9%; model configurations ranged from 85% to 100%. Click the figure to open it at full resolution.</figcaption>
</figure>

Near-ceiling models made too few errors to support reliable M-ratio estimates. A fitted value near one in such a group cannot establish strong metacognition. The evidence tiers were at least 30 errors for data-driven estimates, 10–29 for regularized estimates, and fewer than 10 for prior-dominated estimates.

<figure class="research-figure">
  <a href="/images/socrates/c_errors_ceiling.png"><img src="/images/socrates/c_errors_ceiling.png" width="2661" height="1761" alt="Model error counts showing the measurement ceiling for reliable M-ratio estimation" loading="lazy" decoding="async" /></a>
  <figcaption>Error counts determine estimation reliability: at least 30 errors are data-driven, 10–29 require regularization, and fewer than 10 are prior-dominated. Near-perfect accuracy leaves too little information for a strong M-ratio conclusion. Click the figure to open it at full resolution.</figcaption>
</figure>

## Limitations and Reflection

The human sample was small, mostly students, and drawn from one Chinese-speaking population. Language was confounded with group, and the strongest models saturated this bank. The conclusions are behavioral only. My central lesson is that accuracy, calibration, and internal understanding must not be collapsed into one idea, and that every inference should stay within what the measurement can support.

## What I Can Do Next

I plan to investigate when AI systems produce unsupported answers and how stated confidence relates to those errors. I also want to test an answer-first, explanation-second format to ask whether a correct answer is supported by understanding. The explanation-scoring method still needs to be designed, and fluent language alone will not count as understanding. Finally, I aim to participate in a hackathon at Stanford, build alongside others, and meet people with shared interests; this is a future goal, not a confirmed event, admission, or affiliation.

*Source note: figures and numerical claims on this page come from the project's aggregate analysis.*
