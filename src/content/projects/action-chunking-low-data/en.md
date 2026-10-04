---
title: "Action Chunking under Low Data"
summary: "An ongoing study comparing observation history and prediction memory under limited demonstrations and hidden command delay, with an audited evaluation pipeline."
coverAlt: "Schematic placeholder cover for the action-chunking study"
---

## Research Question

Under limited demonstration data and hidden command-application delay, does a policy benefit more from observation history or controller-level memory of overlapping action predictions? The working title is “Observation Memory or Prediction Memory under Hidden Delay?” The mechanism study is ongoing.

## Why It Matters

A robot may observe the present while earlier commands are still waiting to execute. Observation history and aggregation of past predictions offer different ways to handle that mismatch. A controlled comparison must separate them from prediction horizon, the number of actions executed before replanning, and data volume.

## My Role and Research Process

I am developing the protocol and training/evaluation infrastructure, organizing paired scenarios and nested demonstration subsets, and checking controller behavior and reproducibility. The process starts with a reference baseline and auditable controls before testing the memory hypotheses.

## Study Design

The main protocol uses image-based Diffusion Policy and Drake Push-T. It fixes executed prefix E = 1 and prediction horizon H = 16, varying observation history C, aggregation window W, demonstration count N, and hidden FIFO command delay D. Nested subsets use N = 25, 50, 100, and 180. Generation evaluations (NFE), executed prefix E, and command delay D are distinct variables.

Paired scenario manifests and sampling seeds support matched comparisons. DBP and controlled ACT-CVAE, ACT-no-VAE, and Drifting-ACT comparisons are proposed or gated extensions, not completed findings. The memory hypotheses remain hypotheses.

## Findings and Evidence

Implemented work includes upstream training/evaluation integration, paired scenario manifests, nested subsets, history and aggregation controllers, FIFO delay tests, and audit logging. The Stage0 record reports 47 local tests and two byte-identical reproducibility runs of two rollouts each. These are engineering checks, not evidence of a memory mechanism's advantage.

The provisional upstream-reference evaluation compared final and best EMA checkpoints on the same 50 scenarios and sampling seeds: 41/50 (82%) versus 38/50 (76%), from one training seed. This baseline used C2/rawH16 with 15 future actions and E8; it is not the main H16/E1 experiment. It does not establish a memory-type improvement, a multi-seed conclusion, or a new method outperforming the baseline.

## Limitations and Reflection

The full mechanism study is unfinished. Reference-checkpoint results come from one training seed; small reproducibility checks do not establish robust task performance. Historical incomplete pilots are not treated as completed cross-seed results. Controller semantics and evaluation provenance must be fixed before interpreting performance differences.

## What I Can Do Next

Complete controlled H16/E1 mechanism experiments, repeat across training seeds, and examine paired outcomes across data sizes and delays. Architecture extensions should follow their protocol gates. These are future experiments, not measured improvements.

*Source note: repository experiment design v0.3, September 23 Stage0 and Drake smoke records, and the paired baseline summary. [Source repository (private; collaborator access required)](https://github.com/lucasnotfound59/action-chunking-low-data). Verification is reported from those records; this page does not claim to have rerun the research experiments.*
