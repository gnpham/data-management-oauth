const domain = "https://242e-159-223-94-51.ap.ngrok.io";

module.exports = {
    "facebookAuth": {
        "clientID": "1069553913670923",
        "clientSecret": "5e87c6227a0d557ce1e6e9e3582414e8",
        "callbackURL": `${domain}/auth/facebook/callback`,
    },
    "googleAuth": {
        "clientID": "1046252033118-clknsvl3nmo0seeqbpmaej5ghdmo162q.apps.googleusercontent.com",
        "clientSecret": "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",
        "callbackURL": `${domain}/auth/google/callback`,
    }
}