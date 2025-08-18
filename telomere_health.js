const moment = require('moment');

class TelomereHealthManager {
	constructor() {
		this.userIdToHealthData = new Map();
	}

	getOrCreateUserHealthData(userId) {
		if (!this.userIdToHealthData.has(userId)) {
			this.userIdToHealthData.set(userId, {
				routines: [], // { date, sleepHours, sleepQuality, steps, activityMinutes, hiitSessions, strengthSessions, dietScore, omega3Intake, stressLevel, mindfulnessMinutes }
				biomarkers: [], // { date, hsCRP, fastingGlucose, hba1c, omega3Index }
				telomeres: [] // { date, ltl, units, method }
			});
		}
		return this.userIdToHealthData.get(userId);
	}

	// ===== Routine Tracking =====
	logRoutine(userId, routine) {
		const userData = this.getOrCreateUserHealthData(userId);
		const date = routine.date ? moment(routine.date).toISOString() : moment().toISOString();
		const normalized = {
			date,
			sleepHours: Number(routine.sleepHours ?? 0),
			sleepQuality: Number(routine.sleepQuality ?? 0), // 0-100
			steps: Number(routine.steps ?? 0),
			activityMinutes: Number(routine.activityMinutes ?? 0),
			hiitSessions: Number(routine.hiitSessions ?? 0),
			strengthSessions: Number(routine.strengthSessions ?? 0),
			dietScore: Number(routine.dietScore ?? 0), // Mediterranean adherence 0-100
			omega3Intake: Number(routine.omega3Intake ?? 0), // grams/week
			stressLevel: Number(routine.stressLevel ?? 0), // 0-100 (higher is worse)
			mindfulnessMinutes: Number(routine.mindfulnessMinutes ?? 0)
		};
		userData.routines = userData.routines.filter(r => !moment(r.date).isSame(date, 'day'));
		userData.routines.push(normalized);
		return normalized;
	}

	getDailySignals(userId, dateString) {
		const userData = this.getOrCreateUserHealthData(userId);
		const targetDate = dateString ? moment(dateString) : moment();
		const routine = userData.routines.find(r => moment(r.date).isSame(targetDate, 'day'));
		const base = routine || {
			sleepHours: 0,
			sleepQuality: 0,
			steps: 0,
			activityMinutes: 0,
			hiitSessions: 0,
			strengthSessions: 0,
			dietScore: 0,
			omega3Intake: 0,
			stressLevel: 50,
			mindfulnessMinutes: 0
		};

		// Sleep score: combine duration (optimal 7-9h) and quality (0-100)
		const durationScore = Math.max(0, Math.min(100, 100 - Math.abs(8 - base.sleepHours) * 15));
		const sleepScore = Math.round((durationScore * 0.6 + base.sleepQuality * 0.4));

		// Activity score: steps (target 7000), activity minutes (target 30/day), HIIT/strength bonus
		const stepScore = Math.max(0, Math.min(100, (base.steps / 7000) * 100));
		const activityMinScore = Math.max(0, Math.min(100, (base.activityMinutes / 30) * 100));
		const trainingBonus = Math.min(15, base.hiitSessions * 5 + base.strengthSessions * 5);
		const activityScore = Math.round(Math.min(100, stepScore * 0.5 + activityMinScore * 0.4 + trainingBonus));

		// Diet score: direct dietScore plus omega-3 intake contribution (target 3g/week EPA+DHA)
		const omegaTarget = 3;
		const omegaScore = Math.max(0, Math.min(100, (base.omega3Intake / omegaTarget) * 100));
		const dietScore = Math.round(Math.min(100, base.dietScore * 0.7 + omegaScore * 0.3));

		// Inflammation risk estimate: will be refined by hsCRP when available; proxy from stress and diet
		// Lower is better; start at 50 baseline
		let inflammationRisk = 50;
		inflammationRisk += Math.max(0, (base.stressLevel - 50) * 0.5);
		inflammationRisk -= Math.max(0, (dietScore - 70) * 0.3);
		inflammationRisk = Math.round(Math.max(0, Math.min(100, inflammationRisk)));

		// Telomere lifestyle score: higher is better
		const telomereLifestyleScore = Math.round(
			Math.min(100, sleepScore * 0.35 + activityScore * 0.35 + dietScore * 0.25 + (100 - inflammationRisk) * 0.05)
		);

		return {
			date: targetDate.toISOString(),
			signals: {
				sleepScore,
				activityScore,
				dietScore,
				inflammationRisk,
				telomereLifestyleScore
			},
			inputs: base
		};
	}

	// ===== Biomarker Integration =====
	saveBiomarkers(userId, biomarkers) {
		const userData = this.getOrCreateUserHealthData(userId);
		const date = biomarkers.date ? moment(biomarkers.date).toISOString() : moment().toISOString();
		const entry = {
			date,
			hsCRP: this.#num(biomarkers.hsCRP), // mg/L
			fastingGlucose: this.#num(biomarkers.fastingGlucose), // mg/dL
			hba1c: this.#num(biomarkers.hba1c), // %
			omega3Index: this.#num(biomarkers.omega3Index) // %
		};
		userData.biomarkers.push(entry);
		return entry;
	}

	getBiomarkerReport(userId, range = 'quarter', endDate) {
		const userData = this.getOrCreateUserHealthData(userId);
		const end = endDate ? moment(endDate) : moment();
		const days = range === 'year' ? 365 : 90;
		const start = moment(end).subtract(days, 'days');
		const within = userData.biomarkers.filter(b => moment(b.date).isBetween(start, end, undefined, '[]'));
		const avg = (arr, key) => arr.length ? arr.reduce((s, x) => s + (Number(x[key]) || 0), 0) / arr.length : null;
		const mean = {
			hsCRP: this.#round(avg(within, 'hsCRP')),
			fastingGlucose: this.#round(avg(within, 'fastingGlucose')),
			hba1c: this.#round(avg(within, 'hba1c')),
			omega3Index: this.#round(avg(within, 'omega3Index'))
		};
		const grades = {
			hsCRP: mean.hsCRP == null ? 'N/A' : mean.hsCRP < 1 ? 'Low risk' : mean.hsCRP < 3 ? 'Moderate' : 'High',
			fastingGlucose: mean.fastingGlucose == null ? 'N/A' : mean.fastingGlucose < 100 ? 'Normal' : mean.fastingGlucose < 126 ? 'Prediabetes' : 'Diabetes',
			hba1c: mean.hba1c == null ? 'N/A' : mean.hba1c < 5.7 ? 'Normal' : mean.hba1c < 6.5 ? 'Prediabetes' : 'Diabetes',
			omega3Index: mean.omega3Index == null ? 'N/A' : mean.omega3Index >= 8 ? 'Optimal' : mean.omega3Index >= 6 ? 'Adequate' : 'Low'
		};
		return {
			range,
			start: start.toISOString(),
			end: end.toISOString(),
			measurementsCount: within.length,
			averages: mean,
			grades
		};
	}

	// ===== Telomere Results =====
	saveTelomereResult(userId, result) {
		const userData = this.getOrCreateUserHealthData(userId);
		const date = result.date ? moment(result.date).toISOString() : moment().toISOString();
		const entry = {
			date,
			ltl: this.#num(result.ltl),
			units: result.units || 'T/S', // or 'kb'
			method: result.method || 'qPCR' // or 'Flow-FISH'
		};
		userData.telomeres.push(entry);
		userData.telomeres.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
		return entry;
	}

	getTelomereTrend(userId) {
		const userData = this.getOrCreateUserHealthData(userId);
		const list = userData.telomeres;
		if (!list.length) {
			return { hasData: false, message: 'No telomere data available yet.' };
		}
		const first = list[0];
		const last = list[list.length - 1];
		let changePct = null;
		if (first.ltl && last.ltl) {
			changePct = this.#round(((last.ltl - first.ltl) / first.ltl) * 100);
		}
		let interpretation = 'Maintained';
		if (changePct != null) {
			if (changePct > 2) interpretation = 'Improved';
			else if (changePct < -2) interpretation = 'Declined';
		}
		return {
			hasData: true,
			baseline: first,
			current: last,
			changePercent: changePct,
			interpretation
		};
	}

	// ===== Feedback Engine =====
	generateFeedback(userId) {
		const signals = this.getDailySignals(userId);
		const biomarkerQuarter = this.getBiomarkerReport(userId, 'quarter');
		const telomereTrend = this.getTelomereTrend(userId);

		const recommendations = [];

		// Sleep
		if (signals.signals.sleepScore < 75) {
			recommendations.push('Improve sleep hygiene: target 7–9 hours, consistent schedule, reduce blue light before bed.');
		}

		// Activity
		if (signals.signals.activityScore < 75) {
			recommendations.push('Increase physical activity: 30 minutes daily, add 2 strength sessions and 1–2 HIIT sessions per week.');
		}

		// Diet and Omega-3
		if (signals.signals.dietScore < 80) {
			recommendations.push('Adopt a Mediterranean-style diet rich in plants and healthy fats; consider increasing omega-3 intake.');
		}

		// Inflammation risk via hsCRP
		if (biomarkerQuarter.averages.hsCRP != null && biomarkerQuarter.averages.hsCRP >= 3) {
			recommendations.push('High inflammation indicated (hs-CRP ≥ 3 mg/L): emphasize anti-inflammatory diet and stress reduction.');
		}

		// Glycemic control
		if (biomarkerQuarter.averages.hba1c != null && biomarkerQuarter.averages.hba1c >= 5.7) {
			recommendations.push('Glycemic markers elevated: prioritize balanced meals, fiber intake, and regular activity after meals.');
		}

		// Telomere trend
		if (telomereTrend.hasData && telomereTrend.interpretation === 'Declined') {
			recommendations.push('Telomere trend suggests decline: reinforce consistent sleep, exercise, and anti-inflammatory nutrition.');
		}

		return {
			date: moment().toISOString(),
			lifestyleSignals: signals.signals,
			biomarkerSummary: biomarkerQuarter,
			telomereTrend,
			recommendations
		};
	}

	#num(v) {
		if (v === null || v === undefined || v === '') return null;
		const n = Number(v);
		return Number.isFinite(n) ? n : null;
	}

	#round(v, decimals = 2) {
		if (v === null || v === undefined || !Number.isFinite(v)) return null;
		const p = Math.pow(10, decimals);
		return Math.round(v * p) / p;
	}
}

module.exports = TelomereHealthManager;


