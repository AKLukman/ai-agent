const OpenAI = require( "openai" )
require( 'dotenv' ).config()

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

const analyzeGoal = async () => {
    const goalText = "Learn Python"
    const duration = "7"

    const propmt = `User wants to learn ${ goalText } within ${ duration } days create a structured learning/execution plan`
    try {
        const completion = await openai.chat.completions.create( {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert web developer" },
                { role: "user", content: propmt }
            ],
            temperature: 0.7
        } )

        console.log( completion.choices[ 0 ].message.content )
    } catch ( error ) {
        console.error( error )
    }
}

analyzeGoal()