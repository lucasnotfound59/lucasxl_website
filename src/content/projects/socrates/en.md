---
title: "Project SOCRATES"
summary: "Comparing human and language-model confidence: calibration, uncertainty, and the limits of behavioral evidence."
coverAlt: "Illustration for Project SOCRATES"
---

## Abstract

Large language models (LLMs) can produce fluent answers even when those answers are wrong, making the usefulness of their expressed confidence a practical safety question. This study compares answer–confidence behavior in 46 Chinese-speaking participants (1,647 valid responses) and two model cohorts on a 400-item true/false bank. Nineteen configurations were prompted in English, and six locally served open-weight configurations were prompted in Chinese (9,600 attempts; 9,597 valid responses). All respondents used the same five-level confidence structure. Expected Calibration Error (ECE) measured aggregate calibration bias, while meta-d′/d′ (M-ratio) and Type-2 AUC measured confidence sensitivity conditional on first-order performance. The human cohort had ECE = .086 and a higher ECE than 17 of 19 English-prompted configurations by paired clustered-bootstrap comparison. In the Chinese-prompted cohort, mean model accuracy was .954 and mean ECE was .053, compared with .735 and .086 for humans; one configuration, Qwen3 1.7B Q8_0, had ECE = .101. The human MLE M-ratio was 1.370, whereas data-driven model estimates ranged from .310 to .690 in English and .152 to .458 in Chinese. On fictional versus real-but-obscure entities, humans showed near-zero answer-level discrimination (d′ = .001), whereas Chinese-prompted models ranged from 1.58 to 5.24. These findings describe different observable confidence patterns, not the presence or absence of metacognition, self-awareness, or consciousness. The Chinese-prompted cohort matches the human task language for six configurations, but differences in serving stack, model realization, and sampling prevent a causal interpretation of language.

*Revised abstract, September 20, 2026. The timeline retains the March–August core-study period; the Chinese replication is a September extension.*

## Research Question

Does confidence track correctness in the same way for humans and language models? Project SOCRATES asks this question with a shared True/False task and a shared confidence scale. The goal is not only to ask which group is more accurate, but whether confidence rises and falls with correctness. Reliable AI should communicate uncertainty: an answer that sounds certain when it is wrong can be more harmful than an openly tentative one.

## Why It Matters

Accuracy, calibration, and understanding are different. A system can score highly while giving nearly identical confidence to correct and incorrect answers; it can also be well calibrated in aggregate without knowing why an individual answer is right. SOCRATES therefore treats reported confidence as behavioral evidence. It does not claim that model confidence reveals an internal faculty equivalent to human metacognition.

## My Role and Research Process

This was my independent research project. I developed it through a workflow of question-bank design, human questionnaires and model evaluation, aggregate analysis, and research communication. This page focuses on verified project-level findings and does not publish participant records or claim sole authorship of every technical component in the pipeline.

## Study Design

The bilingual bank contained 400 True/False questions: 100 ordinary-knowledge items, 100 disciplinary items, 100 plausible-sounding pseudoscientific traps, and 100 hallucination items mixing fictional entities with real but obscure ones. After each answer, humans and models used the same five-level retrospective confidence format. Each model received four stochastic samples per question. The revised study includes 46 humans with 1,647 valid answers, 19 English-prompted configurations, and six Chinese-prompted local open-weight configurations with 9,600 attempts and 9,597 valid responses. The two model cohorts are reported separately: language, model coverage, backend, quantization, and sampling differ. Matching the human task language in the Chinese cohort does not isolate a causal language effect.

## Findings and Evidence

The revised abstract above reports the September replication. The four figures below remain from the original English-cohort analysis; their numerical descriptions retain that provenance and are not Chinese-replication plots.

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

The human sample was small, mostly students, and drawn from one Chinese-speaking population. Language was confounded with group in the original comparison. The Chinese replication matches task language for six configurations, but serving stack, model realization, and sampling still differ; it cannot establish a causal language effect. The strongest models saturated this bank. The conclusions are behavioral only. My central lesson is that accuracy, calibration, and internal understanding must not be collapsed into one idea, and that every inference should stay within what the measurement can support.

## What I Can Do Next

I plan to investigate when AI systems produce unsupported answers and how stated confidence relates to those errors. I also want to test an answer-first, explanation-second format to ask whether a correct answer is supported by understanding. The explanation-scoring method still needs to be designed, and fluent language alone will not count as understanding. I have also built [VisitSmoothie](/projects/visit-smoothie/) with friends at a hackathon during Stanford Venture Trip: a completed local prototype for patient communication before and after a medical visit. That collaborative engineering experience is separate from this study's research evidence.

*Source note: the abstract comes verbatim from the September 20 revised paper. The four retained figures and their accompanying numerical claims come from the original aggregate analysis; the model cohorts are not pooled.*
