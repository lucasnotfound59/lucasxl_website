---
title: "Visit Smoothie"
summary: "A collaborative local prototype for patient-confirmed symptoms and clinician instructions, awarded the Grand Prize at the Stanford Hackathon."
coverAlt: "Visit Smoothie welcome screen in Chinese, with a language switch, login and Start My Health Journey button"
---

## Problem and Constraints

Patients need to describe their symptoms before a visit and remember clinician instructions afterward. Visit Smoothie collects and organizes patient-confirmed information without making diagnoses or setting medication doses. The result is a local prototype, not a service deployed for real patients.

## My Responsibilities

I developed Visit Smoothie together with friends at a hackathon during Stanford Venture Trip and was involved across all modules. We collaborated on the patient workflow, interface, AI-assisted collection and organization, and integration. No module is attributed exclusively to me.

## System Overview

Before a visit, onboarding and body-map intake help patients record symptoms, confirm their wording, and prepare a report for a clinician. After a visit, Clinical Plan organizes clinician instructions and follow-up reminders. Account, provider-selection, transcription, report, and settings flows support the workflow. Risky situations direct patients toward medical care.

The screenshot above shows the prototype's Chinese welcome screen, with a Chinese/English switch, registration entry and login. It is an interface example, not evidence of clinical effectiveness.

## Implementation Process

The prototype uses Next.js on Node 24, encrypted server-side SQLite storage, and server-side AI-provider calls with rule fallback. Photo and transcription features require configured credentials. The fixed interface supports English and Chinese; generated and rule-based text remains primarily Chinese. Patient confirmation keeps summaries grounded in patient input and clinician instructions rather than independently choosing treatment.

## Testing and Iterations

Project records describe engineering checks and synthetic-patient scenarios. They support prototype integration, not clinical effectiveness. Real long recordings, real photo inputs, and notification permission have not undergone human trials. Reminders depend on app or browser availability.

## Results

Our team won the **Grand Prize at the Stanford Hackathon** with Visit Smoothie.

The completed local prototype connects symptom intake, patient-confirmed reports, and post-visit instruction organization. It has not been deployed for real patient use. Public deployment, HTTPS, operational key management, medical review, and further privacy safeguards remain work. No measured clinical benefit is claimed.

## Failures and Lessons

Feature availability and reminder delivery depend on configuration and runtime conditions. A visible control alone cannot establish that a workflow works in practice. The project reinforced the need to distinguish patient wording, clinician instructions, and generated organization, and to test real input and delivery conditions before making reliability claims.

*Source note: October 4 repository README and handoff documentation, plus the owner's account of collaborative contributions and October 5 confirmation of the project name and award. [Source repository (private; authorized collaborators only)](https://github.com/lucasnotfound59/TriMedManagement). No patient records or private operational details are published.*
