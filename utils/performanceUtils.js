// Performance tracking and evaluation utilities

/**
 * Calculate performance score based on various metrics
 * @param {Object} employee - Employee performance data
 * @returns {Object} Performance evaluation
 */
export const evaluatePerformance = (employee) => {
  const {
    competences = [],
    formations = [],
    projets = [],
    anciennete = 0,
    evaluationAnnuelle = {}
  } = employee;

  // Skill complexity score
  const skillScore = competences.reduce((score, skill) => {
    switch (skill.niveau) {
      case 'Expert': return score + 3;
      case 'Avancé': return score + 2;
      case 'Intermédiaire': return score + 1;
      default: return score;
    }
  }, 0);

  // Training impact
  const formationScore = formations.reduce((score, formation) => {
    return score + (formation.impact || 0);
  }, 0);

  // Project success rate
  const projetScore = projets.reduce((score, projet) => {
    return score + (projet.reussite ? 1 : -0.5);
  }, 0);

  // Seniority bonus
  const ancienneteScore = Math.min(anciennete * 0.5, 5);

  // Annual evaluation score
  const evaluationScore = evaluationAnnuelle.note || 0;

  // Composite performance score
  const performanceScore = (
    skillScore * 0.3 + 
    formationScore * 0.2 + 
    projetScore * 0.2 + 
    ancienneteScore * 0.1 + 
    evaluationScore * 0.2
  );

  // Performance categorization
  let categorie;
  if (performanceScore >= 8.5) categorie = 'Exceptionnel';
  else if (performanceScore >= 7) categorie = 'Excellent';
  else if (performanceScore >= 5.5) categorie = 'Très Bien';
  else if (performanceScore >= 4) categorie = 'Bien';
  else categorie = 'À Améliorer';

  return {
    score: Math.round(performanceScore * 10) / 10,
    categorie,
    details: {
      competences: skillScore,
      formations: formationScore,
      projets: projetScore,
      anciennete: ancienneteScore,
      evaluation: evaluationScore
    }
  };
};

/**
 * Generate performance improvement recommendations
 * @param {Object} performanceData - Performance evaluation data
 * @returns {Array} Recommended actions
 */
export const generatePerformanceRecommendations = (performanceData) => {
  const recommendations = [];

  if (performanceData.categorie === 'À Améliorer') {
    recommendations.push('Planifier un entretien de développement professionnel');
    recommendations.push('Identifier des formations ciblées');
    recommendations.push('Définir des objectifs de progression clairs');
  }

  if (performanceData.details.competences < 5) {
    recommendations.push('Développer de nouvelles compétences techniques');
  }

  if (performanceData.details.projets < 0) {
    recommendations.push('Améliorer la gestion et la réussite des projets');
  }

  if (performanceData.details.formations < 2) {
    recommendations.push('Encourager la participation à des formations');
  }

  return recommendations;
};

/**
 * Track employee skill progression
 * @param {Array} skillHistory - Historical skill data
 * @returns {Object} Skill progression analysis
 */
export const analyzeSkillProgression = (skillHistory) => {
  const skillProgression = {};

  skillHistory.forEach(entry => {
    Object.keys(entry.skills).forEach(skill => {
      if (!skillProgression[skill]) {
        skillProgression[skill] = {
          progression: [],
          trend: 'stable'
        };
      }
      skillProgression[skill].progression.push(entry.skills[skill]);
    });
  });

  // Determine trend for each skill
  Object.keys(skillProgression).forEach(skill => {
    const progression = skillProgression[skill].progression;
    const trend = progression.reduce((acc, curr, idx) => {
      if (idx > 0) {
        if (curr > progression[idx - 1]) acc.up++;
        else if (curr < progression[idx - 1]) acc.down++;
      }
      return acc;
    }, { up: 0, down: 0 });

    if (trend.up > trend.down) skillProgression[skill].trend = 'croissant';
    else if (trend.up < trend.down) skillProgression[skill].trend = 'décroissant';
  });

  return skillProgression;
};
