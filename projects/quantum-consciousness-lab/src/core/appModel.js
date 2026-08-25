const FLAGSHIP_PATHS = [
  {
    id: 'observer',
    title: 'Observer',
    evidence: 'Established',
    subtitle: 'Attention, awareness, and cognitive decentering.',
    whatWeKnow: 'Mindfulness and decentering can help people relate differently to thoughts and repetitive mental content.',
    explore: 'Quantum measurement is a real physical problem, but psychological observation should be treated as an analogy rather than evidence that the mind collapses external reality.',
  },
  {
    id: 'coherence',
    title: 'Coherence',
    evidence: 'Supported',
    subtitle: 'Slow breathing, interoception, and autonomic regulation.',
    whatWeKnow: 'Slow breathing can influence heart-rate variability and autonomic state, especially near an individual resonant breathing range.',
    explore: 'Broader heart-brain or field interpretations are interesting to some traditions, but should be distinguished from measured respiratory and cardiovascular effects.',
  },
  {
    id: 'intention',
    title: 'Intention',
    evidence: 'Supported',
    subtitle: 'Visualization, mental rehearsal, and concrete next actions.',
    whatWeKnow: 'Attention, expectancy, mental rehearsal, and implementation intentions can influence behavior and performance.',
    explore: 'Manifestation can be explored philosophically or spiritually, but quantum mechanics does not establish that thoughts directly select desired macroscopic outcomes.',
  },
  {
    id: 'quantum-foundations',
    title: 'Quantum Foundations',
    evidence: 'Established',
    subtitle: 'Entanglement, superposition, measurement, and decoherence.',
    whatWeKnow: 'Quantum theory makes extremely accurate predictions and experiments support phenomena such as entanglement and Bell-inequality violations.',
    explore: 'What measurement ultimately means remains philosophically rich, but mainstream quantum mechanics does not require human consciousness to produce ordinary measurement outcomes.',
  },
  {
    id: 'expanded-consciousness',
    title: 'Expanded Consciousness',
    evidence: 'Emerging',
    subtitle: 'Hypnagogia, open awareness, and altered-state exploration.',
    whatWeKnow: 'Meditation, sleep transitions, sensory conditions, and attention can produce unusual but genuine subjective experiences.',
    explore: 'Whether any altered state demonstrates nonlocal or extracorporeal consciousness remains unresolved and should not be presented as established fact.',
  },
  {
    id: 'synchronicity-dreams',
    title: 'Synchronicity & Dreams',
    evidence: 'Philosophical',
    subtitle: 'Dreams, symbols, coincidence, and multiple explanatory lenses.',
    whatWeKnow: 'Dreams, memory, salience, and pattern recognition are well-established psychological phenomena.',
    explore: 'Jungian synchronicity and spiritual interpretations can be meaningful frameworks, but meaningful coincidence is not by itself proof of nonlocal causation.',
  },
];

function createJournalEntry({ category, text, now = Date.now() }) {
  const cleaned = String(text || '').trim();
  return {
    id: `journal-${now}-${Math.random().toString(36).slice(2, 8)}`,
    category: category || 'Reflection',
    text: cleaned,
    createdAt: now,
  };
}

function createExperimentRecord({ protocol, before, after, now = Date.now() }) {
  const beforeNumber = Number(before);
  const afterNumber = Number(after);
  return {
    id: `experiment-${now}-${Math.random().toString(36).slice(2, 8)}`,
    protocol: protocol || 'Coherence',
    before: beforeNumber,
    after: afterNumber,
    change: afterNumber - beforeNumber,
    createdAt: now,
    note: 'This is a personal observation from one session, not proof that the protocol caused the change.',
  };
}

module.exports = { FLAGSHIP_PATHS, createJournalEntry, createExperimentRecord };
