# 💓 Cardiovascular Warning System — AI-Based Early Warning for Acute Cardiovascular Events

Kairos implements an evidence-based early warning system for acute myocardial infarction (AMI) risk assessment, combining medical data, lifestyle metrics, and psychosocial factors to provide real-time risk evaluation and preventive guidance.

## 🧪 Medical Background and Evidence

### Clinical Evidence Base
The system is built on peer-reviewed clinical research and guidelines:

- **Cardiovascular Conditions**
  - Hypertension (JNC 8 Guidelines, 2014) - Weight: 3
  - Hyperlipidemia/High LDL cholesterol (ACC/AHA 2019) - Weight: 3
  - Diabetes mellitus (ADA Standards of Care 2025) - Weight: 4
  - Obesity and high BMI (WHO, 2020) - Weight: 2

- **Lifestyle Factors**
  - Sedentary behavior and lack of exercise (European Heart Journal, 2020) - Weight: 2
  - Poor diet, high sodium intake (Circulation, 2021) - Weight: 2
  - Smoking (Lancet, 2018) - Weight: 4
  - Excessive alcohol (Lancet, 2018) - Weight: 3
  - Sleep deprivation <6 hours/night (Sleep Health, 2019) - Weight: 3

- **Medication Effects**
  - Chronic sedative use (American Journal of Cardiology, 2017) - Weight: 3
  - Sleep medications (American Journal of Cardiology, 2017) - Weight: 2

- **Psychosocial Stress**
  - Social isolation (Circulation, 2018) - Weight: 2
  - Grief and extreme psychological stress (Heart, 2019) - Weight: 4
  - Work-related stress - Weight: 2

### Historical Case Studies
- **Maria Callas (1977)**: Sudden death from AMI at age 53
  - Contributing factors: Rapid weight loss, prolonged sedative use, extreme psychological stress
- **Kim Il-Sung (1994)**: Died of myocardial infarction despite continuous medical supervision

## 🏗️ System Architecture

### 1. Data Collection Layers
- **Physiological Metrics**: Weight, BMI, blood pressure, heart rate, blood sugar, cholesterol
- **Medication Records**: Sedatives, sleep aids, cardiovascular drugs
- **Lifestyle Data**: Sleep quality, exercise, diet, smoking, alcohol, stress
- **Psychosocial Data**: Social interaction, major life events, emotional states

### 2. Memory-Enabled AI Analysis
- **Conversational Analysis**: Detects stress, emotional states, social isolation from user messages
- **Longitudinal Pattern Storage**: Memory module stores patterns for trend analysis
- **Real-time Risk Calculation**: Continuous assessment based on latest data

### 3. Risk Assessment Engine
- **Evidence-Based Scoring**: Weighted multi-factor scoring using clinical evidence
- **Risk Levels**: LOW (0-24), MODERATE (25-49), HIGH (50-74), CRITICAL (75+)
- **Automated Alerts**: Real-time notifications for elevated risk

### 4. Scenario Simulation
- **What-If Analysis**: Simulates impact of lifestyle changes on risk
- **Preventive Guidance**: Provides actionable recommendations
- **Risk Trend Analysis**: Tracks changes over time

## 📊 Data Models

### Physiological Metrics
```json
{
  "weight": 75.5,           // kg
  "bmi": 26.2,             // kg/m²
  "systolicBP": 145,        // mmHg
  "diastolicBP": 92,        // mmHg
  "heartRate": 85,          // bpm
  "bloodSugar": 98,         // mg/dL
  "cholesterol": 220,       // mg/dL
  "ldl": 140,               // mg/dL
  "hdl": 45                 // mg/dL
}
```

### Medication Records
```json
{
  "name": "Alprazolam",
  "type": "sedative",       // sedative, sleep_aid, cardiovascular, other
  "dosage": "0.5mg",
  "frequency": "twice daily",
  "startDate": "2025-01-15",
  "isActive": true
}
```

### Lifestyle Data
```json
{
  "sleepHours": 5.5,        // hours
  "sleepQuality": 60,       // 0-100
  "exerciseMinutes": 20,    // minutes
  "exerciseType": "walking",
  "steps": 5000,            // daily steps
  "dietQuality": 65,        // 0-100
  "sodiumIntake": 2800,     // mg
  "smokingStatus": "current", // never, former, current
  "alcoholConsumption": 2,  // drinks/week
  "stressLevel": 7          // 0-10
}
```

### Psychosocial Data
```json
{
  "stressLevel": 8,         // 0-10
  "socialInteraction": "isolated", // frequent, moderate, rare, isolated
  "majorLifeEvents": ["loss of spouse", "job change"],
  "emotionalState": "grieving", // calm, anxious, depressed, grieving
  "workStress": 9,          // 0-10
  "familyStress": 6,        // 0-10
  "griefLevel": 9           // 0-10
}
```

## 🔌 API Endpoints

All endpoints require Bearer authentication.

### Data Recording
- `POST /api/cardiovascular/:userId/physiological` - Record physiological metrics
- `POST /api/cardiovascular/:userId/medication` - Record medication information
- `POST /api/cardiovascular/:userId/lifestyle` - Record lifestyle data
- `POST /api/cardiovascular/:userId/psychosocial` - Record psychosocial data

### Risk Assessment
- `GET /api/cardiovascular/:userId/risk-assessment` - Perform risk assessment
- `GET /api/cardiovascular/:userId/risk-profile` - Get user risk profile
- `GET /api/cardiovascular/:userId/risk-trends?days=30` - Get risk trends
- `POST /api/cardiovascular/:userId/simulation` - Simulate risk scenarios
- `GET /api/cardiovascular/:userId/alerts` - Get user alerts

## 🧭 Usage Examples

### 1. Record Physiological Metrics
```bash
curl -X POST http://localhost:3000/api/cardiovascular/user_001/physiological \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 78.5,
    "bmi": 27.1,
    "systolicBP": 150,
    "diastolicBP": 95,
    "heartRate": 88,
    "bloodSugar": 105,
    "cholesterol": 235,
    "ldl": 155,
    "hdl": 42
  }'
```

### 2. Record Medication
```bash
curl -X POST http://localhost:3000/api/cardiovascular/user_001/medication \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Diazepam",
    "type": "sedative",
    "dosage": "5mg",
    "frequency": "as needed",
    "startDate": "2025-01-01",
    "isActive": true
  }'
```

### 3. Record Lifestyle Data
```bash
curl -X POST http://localhost:3000/api/cardiovascular/user_001/lifestyle \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "sleepHours": 4.5,
    "sleepQuality": 40,
    "exerciseMinutes": 15,
    "exerciseType": "minimal",
    "steps": 3000,
    "dietQuality": 55,
    "sodiumIntake": 3200,
    "smokingStatus": "current",
    "alcoholConsumption": 5,
    "stressLevel": 9
  }'
```

### 4. Record Psychosocial Data
```bash
curl -X POST http://localhost:3000/api/cardiovascular/user_001/psychosocial \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "stressLevel": 9,
    "socialInteraction": "isolated",
    "majorLifeEvents": ["bereavement", "social isolation"],
    "emotionalState": "grieving",
    "workStress": 10,
    "familyStress": 8,
    "griefLevel": 10
  }'
```

### 5. Perform Risk Assessment
```bash
curl -X GET http://localhost:3000/api/cardiovascular/user_001/risk-assessment \
  -H "Authorization: Bearer your-secret-key-here"
```

### 6. Simulate Risk Scenario
```bash
curl -X POST http://localhost:3000/api/cardiovascular/user_001/simulation \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "skipExercise": true,
    "sleepLess": true,
    "increaseStress": true,
    "poorDiet": true
  }'
```

### 7. Get Risk Profile
```bash
curl -X GET http://localhost:3000/api/cardiovascular/user_001/risk-profile \
  -H "Authorization: Bearer your-secret-key-here"
```

### 8. Get Risk Trends
```bash
curl -X GET "http://localhost:3000/api/cardiovascular/user_001/risk-trends?days=30" \
  -H "Authorization: Bearer your-secret-key-here"
```

## 🎭 Risk Assessment Logic

### Risk Factor Weights
- **High Impact (4 points)**: Diabetes, smoking, extreme psychological stress
- **Medium Impact (3 points)**: Hypertension, hyperlipidemia, sedative use, high blood pressure/sugar/cholesterol
- **Lower Impact (2 points)**: Obesity, sedentary behavior, poor diet, social isolation, work stress

### Risk Level Thresholds
- **LOW**: 0-24 points - Minimal risk
- **MODERATE**: 25-49 points - Some risk factors present
- **HIGH**: 50-74 points - Elevated risk, consider medical consultation
- **CRITICAL**: 75+ points - High risk, immediate medical attention recommended

### Alert Generation
- **HIGH Risk**: "Your acute myocardial infarction risk is elevated today (HIGH risk level)."
- **CRITICAL Risk**: "Your acute myocardial infarction risk is elevated today (CRITICAL risk level)."

## 💡 Preventive Recommendations

### Sleep & Recovery
- Prioritize sleep hygiene and aim for 7-9 hours per night
- Reduce blue light exposure before bedtime
- Maintain consistent sleep schedule

### Physical Activity
- Increase physical activity to at least 30 minutes daily
- Add strength training 2-3 times per week
- Consider HIIT sessions for cardiovascular health

### Diet & Nutrition
- Reduce sodium intake to less than 2,300mg per day
- Adopt Mediterranean-style diet rich in plants and healthy fats
- Monitor blood sugar and cholesterol levels

### Stress Management
- Implement work-life balance strategies
- Seek professional mental health support when needed
- Practice stress reduction techniques (meditation, deep breathing)

### Medical Consultation
- Consult physician for blood pressure management
- Review medication use, especially sedatives
- Consider smoking cessation programs

## 🔬 Scientific Validation

The system's risk assessment algorithms are based on:
- **JNC 8 Guidelines (2014)** for hypertension management
- **ACC/AHA 2019** guidelines for cholesterol management
- **ADA Standards of Care 2025** for diabetes management
- **WHO 2020** recommendations for obesity and BMI
- **European Heart Journal (2020)** for exercise and cardiovascular health
- **Circulation (2021)** for dietary sodium and cardiovascular risk
- **Lancet (2018)** for smoking and alcohol effects
- **Sleep Health (2019)** for sleep deprivation and cardiovascular risk
- **American Journal of Cardiology (2017)** for medication effects
- **Heart (2019)** for psychosocial stress and acute coronary events

## 🚨 Emergency Response

### When Risk is CRITICAL
1. **Immediate Action**: Contact healthcare provider or emergency services
2. **Symptom Monitoring**: Watch for chest pain, shortness of breath, nausea
3. **Lifestyle Modification**: Implement all preventive recommendations
4. **Medical Evaluation**: Comprehensive cardiovascular assessment

### Continuous Monitoring
- Daily risk assessments
- Weekly trend analysis
- Monthly comprehensive reviews
- Quarterly medical consultations

## 🔐 Privacy and Security

- **Local Processing**: All risk calculations performed locally
- **Encrypted Storage**: User data encrypted using AES-256-GCM
- **HIPAA Compliance**: Designed to meet healthcare privacy standards
- **User Control**: Complete control over data sharing and retention

## 📈 Future Enhancements

- **Machine Learning Models**: Integration with Random Forest, XGBoost, LSTM
- **Wearable Integration**: Real-time data from smartwatches and health monitors
- **Telemedicine Integration**: Direct connection to healthcare providers
- **Predictive Analytics**: Advanced risk prediction using historical patterns
- **Clinical Decision Support**: Integration with electronic health records

## ⚠️ Important Notes

- **Not a Diagnostic Tool**: This system provides risk assessment, not medical diagnosis
- **Professional Consultation**: Always consult healthcare providers for medical decisions
- **Emergency Situations**: In case of chest pain or other symptoms, call emergency services immediately
- **Data Accuracy**: Risk assessment quality depends on accurate input data
- **Regular Updates**: Keep the system updated with latest health information

---

*This system represents a significant advancement in preventive cardiovascular care, combining evidence-based medicine with AI-powered risk assessment to provide actionable health insights.*
