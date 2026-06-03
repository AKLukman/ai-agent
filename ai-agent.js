import OpenAI from 'openai'
import dotenv from "dotenv";
import { json } from 'express';


const openai = new OpenAI( {
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTRER_API_KEY,
    //     defaultHeaders: {
    //         ${ getHeaderLines().join( '\n        ' ) }
    //   },
} )

async function main() {
    const completion = await openai.chat.completions.create( {
        model: "stepfun/step-3.5-flash:free",
        messages: [
            { role: "user", content: "Which one is best ai agent " }
        ],
    } )

    console.log( completion.choices[ 0 ].message.content )
}

export const analyzeGoal = async ( goalText, durationDays ) => {

    const prompt = `User wants to ${ goalText } within ${ durationDays } days. 
    create a structured learning/execution plan with:
    1. main milestones for each week.
    2. success matrices
    3. potential challenges
    4. motivational approch

    Return as JSON with this structure:
    {
      "milestones": ["milestone1", "milestone2", "milestone3"],
      "dailyTasks": [{"day": 1, "title": "....", "description": "..."}],
      "successMetrics": ["metric 1", "metric 2", "metric 3"],
      "challenges": ["challenge 1"],
      "motivationalApproach": "...."
    } 
  `;
    try {
        const completion = await openai.chat.completions.create( {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert web developer" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        } )

        // console.log( completion.choices[ 0 ].message.content )

        const content = completion.choices[ 0 ].message.content;
        const jsonMatch = content.match( /\{[\s\S]*\}/ )
        return JSON.parse( jsonMatch )
    } catch ( error ) {
        console.error( error )
    }
}

export const evaluateProgress = async ( goal, completedTasks, totalTasks, days ) => {
    const completionRate = ( ( completedTasks / totalTasks ) * 100 ).toFixed( 2 ); // 72
    const expectedRate = ( ( days / goal.durationDays ) * 100 ).toFixed( 2 );  // 90
    const onTrack = completionRate >= expectedRate - 10

    const prompt = `Learning Goal: "${ goal.title }"
  Duration: "${ goal.durationDays }"
  Days Elapsed: ${ days } days
  Task Completion Rate: ${ completionRate }  
  Expected Task completion rate: ${ expectedRate }
  status: ${ onTrack ? "ON TRACK" : "BEHIND" }

  Generate: 
  1. Performance analysis
  2. Specific encouragement 
  3. Recommend next action (just 1-3 lines)
  4. Weekly tips

  Return as JSON: 
  {
    "analysis": ".....",
    "encourgement": ".....",
    "nextAction": ".....",
    "tip": "....."
  }
  `

    try {
        const response = await openai.chat.completions.create( {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: 'system',
                    content: "You are a supportive and smart productivity coach. Be encouraging but honest. Adapt your tone based on progress."
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
        } )

        const content = response.choices[ 0 ].message.content;
        const jsonMatch = content.match( /\{[\s\S]*\}/ )
        return JSON.parse( jsonMatch )

    } catch ( err ) {
        console.error( err )
    }

}

