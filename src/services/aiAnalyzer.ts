export interface AIAnalysis {
  score: number // 0-100, higher is better
  issues: AIIssue[]
  suggestions: AISuggestion[]
  mentalHealthScore: number // 0-100, higher is more supportive
  respectScore: number // 0-100, higher is more respectful
  profanityScore: number // 0-100, higher is cleaner
  isBlocked: boolean // true if message contains severe violations
}

export interface AIIssue {
  type: 'tone' | 'urgency' | 'boundary' | 'clarity' | 'mental-health' | 'respect' | 'profanity' | 'harassment' | 'discrimination'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  position?: { start: number; end: number }
  flagged?: boolean // For content that should be blocked
}

export interface AISuggestion {
  type: 'rewrite' | 'addition' | 'removal' | 'tone-adjustment' | 'complete-rewrite'
  original: string
  suggested: string
  reason: string
  category: 'mental-health' | 'respect' | 'clarity' | 'boundary' | 'profanity' | 'professionalism'
}

class EnhancedAIMessageAnalyzer {
  // Comprehensive profanity and inappropriate content detection
  private profanityPatterns = {
    // Mild profanity (replaceable)
    mild: [
      'damn', 'hell', 'crap', 'suck', 'sucks', 'stupid', 'dumb', 'idiot', 'moron', 'jerk'
    ],
    
    // Moderate profanity (flagged for replacement)
    moderate: [
      'shit', 'piss', 'ass', 'bitch', 'bastard', 'wtf', 'omg', 'jesus christ', 'god damn'
    ],
    
    // Severe profanity (blocked)
    severe: [
      'fuck', 'fucking', 'fucked', 'motherfucker', 'asshole', 'dickhead', 'cocksucker',
      'son of a bitch', 'piece of shit', 'bullshit'
    ],
    
    // Discriminatory language (blocked)
    discriminatory: [
      // Racial slurs and discriminatory terms would go here
      // Note: I'm not listing actual slurs for obvious reasons
      'retard', 'retarded', 'gay' // when used as insults
    ],
    
    // Harassment patterns
    harassment: [
      'shut up', 'go to hell', 'screw you', 'piss off', 'get lost', 'drop dead'
    ]
  }

  // Professional alternatives for inappropriate language
  private professionalAlternatives = {
    'damn': 'unfortunate',
    'hell': 'difficult situation',
    'crap': 'poor quality',
    'suck': 'is challenging',
    'sucks': 'is problematic',
    'stupid': 'ineffective',
    'dumb': 'unclear',
    'idiot': 'person who made an error',
    'moron': 'someone who needs guidance',
    'jerk': 'difficult person',
    'shit': 'problem',
    'piss': 'frustrate',
    'ass': 'person',
    'bitch': 'complain',
    'bastard': 'difficult person',
    'wtf': 'what is happening',
    'omg': 'surprisingly',
    'jesus christ': 'goodness',
    'god damn': 'very frustrating'
  }

  // Toxic behavior patterns
  private toxicPatterns = {
    aggressive: [
      'you always', 'you never', 'typical', 'obviously you', 'clearly you don\'t',
      'how hard is it', 'are you kidding me', 'seriously?', 'unbelievable'
    ],
    
    passive_aggressive: [
      'fine whatever', 'if you say so', 'sure thing', 'noted', 'interesting choice',
      'good luck with that', 'hope that works out', 'we\'ll see'
    ],
    
    dismissive: [
      'whatever', 'not my problem', 'figure it out', 'deal with it', 'your call',
      'if you insist', 'suit yourself'
    ],
    
    threatening: [
      'or else', 'you better', 'don\'t make me', 'last warning', 'final notice',
      'consequences', 'you\'ll regret', 'watch yourself'
    ]
  }

  // Mental health supportive language
  private mentalHealthKeywords = {
    negative: [
      'urgent', 'asap', 'immediately', 'crisis', 'emergency', 'failure', 'wrong', 'bad', 
      'terrible', 'awful', 'disaster', 'catastrophe', 'nightmare', 'hopeless', 'useless',
      'worthless', 'pathetic', 'incompetent', 'lazy', 'careless', 'irresponsible'
    ],
    positive: [
      'when convenient', 'at your earliest convenience', 'when you have time', 'no rush', 
      'flexible', 'support', 'help', 'appreciate', 'thank you', 'great work', 'well done',
      'excellent', 'outstanding', 'impressive', 'valuable', 'important', 'meaningful'
    ]
  }

  // Respectful communication patterns
  private respectKeywords = {
    demanding: [
      'you need to', 'you must', 'you should', 'do this now', 'get this done',
      'make sure you', 'don\'t forget to', 'remember to', 'you have to'
    ],
    respectful: [
      'could you please', 'would you mind', 'if possible', 'when you can', 'i would appreciate',
      'would it be possible', 'if you have time', 'when convenient', 'please consider'
    ]
  }

  analyzeMessage(content: string, scheduledTime: string): AIAnalysis {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    let isBlocked = false
    
    // Enhanced profanity and inappropriate content analysis
    const profanityAnalysis = this.analyzeProfanityAndInappropriateContent(content)
    issues.push(...profanityAnalysis.issues)
    suggestions.push(...profanityAnalysis.suggestions)
    if (profanityAnalysis.isBlocked) isBlocked = true

    // Toxic behavior pattern analysis
    const toxicityAnalysis = this.analyzeToxicBehavior(content)
    issues.push(...toxicityAnalysis.issues)
    suggestions.push(...toxicityAnalysis.suggestions)

    // Enhanced tone and urgency analysis
    const toneAnalysis = this.analyzeToneAndUrgency(content)
    issues.push(...toneAnalysis.issues)
    suggestions.push(...toneAnalysis.suggestions)

    // Mental health impact analysis
    const mentalHealthAnalysis = this.analyzeMentalHealthImpact(content)
    issues.push(...mentalHealthAnalysis.issues)
    suggestions.push(...mentalHealthAnalysis.suggestions)

    // Respect and inclusivity analysis
    const respectAnalysis = this.analyzeRespectAndInclusivity(content)
    issues.push(...respectAnalysis.issues)
    suggestions.push(...respectAnalysis.suggestions)

    // Timing and boundary analysis
    const timingAnalysis = this.analyzeTimingAndBoundaries(content, scheduledTime)
    issues.push(...timingAnalysis.issues)
    suggestions.push(...timingAnalysis.suggestions)

    // Calculate enhanced scores
    const profanityScore = this.calculateProfanityScore(content, issues)
    const mentalHealthScore = this.calculateMentalHealthScore(content, issues)
    const respectScore = this.calculateRespectScore(content, issues)
    const overallScore = isBlocked ? 0 : Math.round((profanityScore + mentalHealthScore + respectScore) / 3)

    return {
      score: overallScore,
      issues,
      suggestions,
      mentalHealthScore,
      respectScore,
      profanityScore,
      isBlocked
    }
  }

  private analyzeProfanityAndInappropriateContent(content: string) {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    const lowerContent = content.toLowerCase()
    let isBlocked = false

    // Check for severe profanity (blocks message)
    this.profanityPatterns.severe.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      if (regex.test(lowerContent)) {
        issues.push({
          type: 'profanity',
          severity: 'critical',
          description: `Severe profanity detected: "${word}". Message blocked for workplace appropriateness.`,
          flagged: true
        })
        isBlocked = true
      }
    })

    // Check for discriminatory language (blocks message)
    this.profanityPatterns.discriminatory.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi')
      if (regex.test(lowerContent)) {
        issues.push({
          type: 'discrimination',
          severity: 'critical',
          description: `Discriminatory language detected: "${term}". Message blocked to maintain respectful workplace.`,
          flagged: true
        })
        isBlocked = true
      }
    })

    // Check for harassment patterns (blocks message)
    this.profanityPatterns.harassment.forEach(phrase => {
      if (lowerContent.includes(phrase)) {
        issues.push({
          type: 'harassment',
          severity: 'critical',
          description: `Harassment language detected: "${phrase}". Message blocked to prevent workplace hostility.`,
          flagged: true
        })
        isBlocked = true
      }
    })

    // Check for moderate profanity (suggests replacement)
    this.profanityPatterns.moderate.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      if (regex.test(lowerContent)) {
        issues.push({
          type: 'profanity',
          severity: 'high',
          description: `Inappropriate language detected: "${word}". Consider professional alternatives.`
        })

        const alternative = this.professionalAlternatives[word as keyof typeof this.professionalAlternatives]
        if (alternative) {
          suggestions.push({
            type: 'rewrite',
            original: word,
            suggested: alternative,
            reason: 'Maintains professional workplace communication standards',
            category: 'profanity'
          })
        }
      }
    })

    // Check for mild profanity (suggests improvement)
    this.profanityPatterns.mild.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      if (regex.test(lowerContent)) {
        issues.push({
          type: 'profanity',
          severity: 'medium',
          description: `Unprofessional language detected: "${word}". Consider more professional alternatives.`
        })

        const alternative = this.professionalAlternatives[word as keyof typeof this.professionalAlternatives]
        if (alternative) {
          suggestions.push({
            type: 'rewrite',
            original: word,
            suggested: alternative,
            reason: 'Enhances professional tone and workplace respect',
            category: 'profanity'
          })
        }
      }
    })

    return { issues, suggestions, isBlocked }
  }

  private analyzeToxicBehavior(content: string) {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    const lowerContent = content.toLowerCase()

    // Check for aggressive patterns
    this.toxicPatterns.aggressive.forEach(pattern => {
      if (lowerContent.includes(pattern)) {
        issues.push({
          type: 'tone',
          severity: 'high',
          description: `Aggressive communication pattern detected: "${pattern}". This may create workplace tension.`
        })

        const constructiveAlternatives = {
          'you always': 'I\'ve noticed that sometimes',
          'you never': 'it would be helpful if',
          'typical': 'this situation',
          'obviously you': 'it appears that',
          'clearly you don\'t': 'perhaps we could clarify',
          'how hard is it': 'could we find a way to',
          'are you kidding me': 'I\'m surprised by this',
          'seriously?': 'I\'d like to understand this better',
          'unbelievable': 'unexpected'
        }

        const alternative = constructiveAlternatives[pattern as keyof typeof constructiveAlternatives]
        if (alternative) {
          suggestions.push({
            type: 'rewrite',
            original: pattern,
            suggested: alternative,
            reason: 'Promotes constructive dialogue and reduces workplace conflict',
            category: 'respect'
          })
        }
      }
    })

    // Check for passive-aggressive patterns
    this.toxicPatterns.passive_aggressive.forEach(pattern => {
      if (lowerContent.includes(pattern)) {
        issues.push({
          type: 'tone',
          severity: 'medium',
          description: `Passive-aggressive tone detected: "${pattern}". Consider more direct, constructive communication.`
        })
      }
    })

    // Check for threatening language
    this.toxicPatterns.threatening.forEach(pattern => {
      if (lowerContent.includes(pattern)) {
        issues.push({
          type: 'harassment',
          severity: 'critical',
          description: `Threatening language detected: "${pattern}". This violates workplace conduct policies.`,
          flagged: true
        })
      }
    })

    return { issues, suggestions }
  }

  private analyzeToneAndUrgency(content: string) {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    const lowerContent = content.toLowerCase()

    // Check for demanding language
    this.respectKeywords.demanding.forEach(phrase => {
      if (lowerContent.includes(phrase)) {
        issues.push({
          type: 'tone',
          severity: 'medium',
          description: `Demanding language detected: "${phrase}". Consider more collaborative phrasing.`
        })

        const respectfulAlternatives = {
          'you need to': 'could you please',
          'you must': 'would you mind',
          'you should': 'it would be helpful if you could',
          'do this now': 'when you have a chance, could you',
          'get this done': 'please complete this when convenient',
          'make sure you': 'please ensure that you',
          'don\'t forget to': 'please remember to',
          'remember to': 'please don\'t forget to',
          'you have to': 'it would be great if you could'
        }

        const alternative = respectfulAlternatives[phrase as keyof typeof respectfulAlternatives]
        if (alternative) {
          suggestions.push({
            type: 'rewrite',
            original: phrase,
            suggested: alternative,
            reason: 'Creates more respectful and collaborative workplace communication',
            category: 'respect'
          })
        }
      }
    })

    // Check for excessive urgency
    const urgencyWords = ['urgent', 'asap', 'immediately', 'now', 'emergency', 'critical', 'rush']
    const urgencyCount = urgencyWords.filter(word => lowerContent.includes(word)).length
    
    if (urgencyCount > 2) {
      issues.push({
        type: 'urgency',
        severity: 'high',
        description: 'Excessive urgency language may cause unnecessary stress and anxiety.'
      })

      suggestions.push({
        type: 'tone-adjustment',
        original: content,
        suggested: content.replace(/urgent|asap|immediately|now|rush/gi, 'when convenient'),
        reason: 'Reduces workplace stress and respects work-life balance',
        category: 'mental-health'
      })
    }

    return { issues, suggestions }
  }

  private analyzeMentalHealthImpact(content: string) {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    const lowerContent = content.toLowerCase()

    // Check for stress-inducing language
    const stressWords = [
      'failure', 'wrong', 'bad', 'terrible', 'awful', 'disaster', 'catastrophe', 
      'nightmare', 'hopeless', 'useless', 'worthless', 'pathetic', 'incompetent'
    ]
    
    stressWords.forEach(word => {
      if (lowerContent.includes(word)) {
        issues.push({
          type: 'mental-health',
          severity: 'high',
          description: `Potentially harmful language detected: "${word}". This may negatively impact mental health.`
        })

        const supportiveAlternatives = {
          'failure': 'learning opportunity',
          'wrong': 'needs adjustment',
          'bad': 'could be improved',
          'terrible': 'challenging',
          'awful': 'difficult',
          'disaster': 'setback',
          'catastrophe': 'significant challenge',
          'nightmare': 'complex situation',
          'hopeless': 'challenging but manageable',
          'useless': 'needs improvement',
          'worthless': 'has potential for improvement',
          'pathetic': 'needs development',
          'incompetent': 'developing skills'
        }

        const alternative = supportiveAlternatives[word as keyof typeof supportiveAlternatives]
        if (alternative) {
          suggestions.push({
            type: 'rewrite',
            original: word,
            suggested: alternative,
            reason: 'Promotes positive mental health and constructive feedback',
            category: 'mental-health'
          })
        }
      }
    })

    // Check for supportive elements
    const supportiveElements = [
      'thank you', 'appreciate', 'great work', 'well done', 'excellent', 
      'support', 'help', 'valuable', 'important', 'meaningful'
    ]
    const hasSupportiveLanguage = supportiveElements.some(element => lowerContent.includes(element))

    if (!hasSupportiveLanguage && content.length > 50) {
      suggestions.push({
        type: 'addition',
        original: content,
        suggested: content + '\n\nThank you for your time and effort on this.',
        reason: 'Adding appreciation improves workplace relationships and mental wellbeing',
        category: 'mental-health'
      })
    }

    return { issues, suggestions }
  }

  private analyzeRespectAndInclusivity(content: string) {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    const lowerContent = content.toLowerCase()

    // Check for lack of politeness
    const hasPleasantries = ['please', 'thank you', 'thanks', 'appreciate'].some(word => 
      lowerContent.includes(word)
    )

    if (!hasPleasantries && content.length > 30) {
      issues.push({
        type: 'respect',
        severity: 'low',
        description: 'Message could benefit from more polite and respectful language.'
      })

      suggestions.push({
        type: 'addition',
        original: content,
        suggested: 'Please ' + content.charAt(0).toLowerCase() + content.slice(1),
        reason: 'Adding politeness markers enhances workplace respect',
        category: 'respect'
      })
    }

    // Check for inclusive language
    const exclusiveTerms = ['guys', 'manpower', 'chairman', 'mankind', 'manmade']
    exclusiveTerms.forEach(term => {
      if (lowerContent.includes(term)) {
        issues.push({
          type: 'respect',
          severity: 'medium',
          description: `Consider more inclusive language instead of "${term}".`
        })

        const inclusiveAlternatives = {
          'guys': 'everyone/team',
          'manpower': 'workforce/staff',
          'chairman': 'chairperson',
          'mankind': 'humanity',
          'manmade': 'artificial/synthetic'
        }

        const alternative = inclusiveAlternatives[term as keyof typeof inclusiveAlternatives]
        suggestions.push({
          type: 'rewrite',
          original: term,
          suggested: alternative,
          reason: 'Promotes inclusive and respectful workplace communication',
          category: 'respect'
        })
      }
    })

    return { issues, suggestions }
  }

  private analyzeTimingAndBoundaries(content: string, scheduledTime: string) {
    const issues: AIIssue[] = []
    const suggestions: AISuggestion[] = []
    const hour = parseInt(scheduledTime.split(':')[0])

    // Check if message implies after-hours work
    const afterHoursImplications = [
      'tonight', 'this evening', 'over the weekend', 'before tomorrow',
      'after hours', 'late night', 'early morning'
    ]
    const lowerContent = content.toLowerCase()

    afterHoursImplications.forEach(phrase => {
      if (lowerContent.includes(phrase)) {
        issues.push({
          type: 'boundary',
          severity: 'high',
          description: `Message implies after-hours work: "${phrase}". This may violate work-life balance.`
        })

        suggestions.push({
          type: 'rewrite',
          original: phrase,
          suggested: 'during business hours',
          reason: 'Respects work-life boundaries and employee wellbeing',
          category: 'boundary'
        })
      }
    })

    // Early morning scheduling suggestions
    if (hour < 8) {
      suggestions.push({
        type: 'addition',
        original: content,
        suggested: content + '\n\n(No need to respond until you start your workday)',
        reason: 'Clarifies no immediate response expected, respecting personal time',
        category: 'mental-health'
      })
    }

    return { issues, suggestions }
  }

  private calculateProfanityScore(content: string, issues: AIIssue[]): number {
    let score = 100
    const lowerContent = content.toLowerCase()

    // Deduct heavily for profanity and inappropriate content
    issues.forEach(issue => {
      if (issue.type === 'profanity') {
        score -= issue.severity === 'critical' ? 50 : issue.severity === 'high' ? 30 : 15
      }
      if (issue.type === 'harassment' || issue.type === 'discrimination') {
        score -= 50 // Major deduction for harassment/discrimination
      }
    })

    return Math.max(0, Math.min(100, score))
  }

  private calculateMentalHealthScore(content: string, issues: AIIssue[]): number {
    let score = 100
    const lowerContent = content.toLowerCase()

    // Deduct for mental health issues
    issues.forEach(issue => {
      if (issue.type === 'mental-health') {
        score -= issue.severity === 'critical' ? 30 : issue.severity === 'high' ? 20 : 10
      }
      if (issue.type === 'urgency') {
        score -= issue.severity === 'high' ? 15 : 10
      }
      if (issue.type === 'boundary') {
        score -= issue.severity === 'high' ? 25 : 15
      }
    })

    // Add points for positive elements
    const positiveElements = [
      'thank you', 'appreciate', 'great work', 'support', 'help', 'when convenient',
      'excellent', 'valuable', 'important', 'meaningful'
    ]
    positiveElements.forEach(element => {
      if (lowerContent.includes(element)) {
        score += 5
      }
    })

    return Math.max(0, Math.min(100, score))
  }

  private calculateRespectScore(content: string, issues: AIIssue[]): number {
    let score = 100
    const lowerContent = content.toLowerCase()

    // Deduct for respect issues
    issues.forEach(issue => {
      if (issue.type === 'respect') {
        score -= issue.severity === 'critical' ? 30 : issue.severity === 'high' ? 20 : 10
      }
      if (issue.type === 'tone') {
        score -= issue.severity === 'high' ? 15 : 10
      }
    })

    // Add points for respectful language
    const respectfulElements = [
      'please', 'thank you', 'could you', 'would you mind', 'if possible',
      'appreciate', 'when convenient'
    ]
    respectfulElements.forEach(element => {
      if (lowerContent.includes(element)) {
        score += 5
      }
    })

    return Math.max(0, Math.min(100, score))
  }

  generateImprovedMessage(content: string, suggestions: AISuggestion[]): string {
    let improvedContent = content

    // Apply suggestions in order of importance
    const sortedSuggestions = suggestions.sort((a, b) => {
      const priority = { 
        'profanity': 5, 
        'mental-health': 4, 
        'boundary': 3, 
        'respect': 2, 
        'clarity': 1,
        'professionalism': 3
      }
      return priority[b.category] - priority[a.category]
    })

    sortedSuggestions.forEach(suggestion => {
      if (suggestion.type === 'rewrite') {
        improvedContent = improvedContent.replace(
          new RegExp(suggestion.original, 'gi'), 
          suggestion.suggested
        )
      } else if (suggestion.type === 'addition') {
        improvedContent = suggestion.suggested
      } else if (suggestion.type === 'tone-adjustment') {
        improvedContent = suggestion.suggested
      }
    })

    return improvedContent
  }

  // Method to check if message should be completely blocked
  isMessageBlocked(analysis: AIAnalysis): boolean {
    return analysis.isBlocked || analysis.issues.some(issue => 
      issue.flagged || 
      (issue.type === 'profanity' && issue.severity === 'critical') ||
      (issue.type === 'harassment' && issue.severity === 'critical') ||
      (issue.type === 'discrimination' && issue.severity === 'critical')
    )
  }
}

export const aiAnalyzer = new EnhancedAIMessageAnalyzer()
