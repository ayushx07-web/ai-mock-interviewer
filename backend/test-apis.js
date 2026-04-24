const fs = require('fs');

async function testApis() {
    console.log("Starting API tests...");
    const baseUrl = 'http://localhost:8081/api';

    try {
        // 1. Register
        console.log("1. Registering user");
        let res = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                college: 'Test College',
                targetRole: 'SDE'
            })
        });
        
        // If already exists, we will just login
        if (res.status === 400) {
           console.log("User might already exist, proceeding to login.");
        } else {
           let data = await res.json();
           console.log("Register response:", data);
        }

        // 2. Login
        console.log("2. Logging in");
        res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        let data = await res.json();
        const token = data.data.token;
        console.log("Login successful, token:", token.substring(0, 20) + "...");

        // 3. /auth/me
        console.log("3. Fetching /auth/me");
        res = await fetch(`${baseUrl}/auth/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        data = await res.json();
        console.log("/auth/me response:", data.data.email);

        // 4. Create Session
        console.log("4. Creating Session");
        res = await fetch(`${baseUrl}/sessions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mode: 'SOLO',
                roleTag: 'SDE',
                companyTag: 'MNC'
            })
        });
        data = await res.json();
        const sessionId = data.data.id;
        console.log("Session created, id:", sessionId);

        // Fetch Session details to get questions
        console.log("5. Fetching session details");
        res = await fetch(`${baseUrl}/sessions/${sessionId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        data = await res.json();
        const firstQuestionId = data.data.answers[0].question.id;
        console.log("Session has", data.data.answers.length, "questions. First question id:", firstQuestionId);

        // 6. Submit Text Answer
        console.log("6. Submitting test answer");
        res = await fetch(`${baseUrl}/sessions/${sessionId}/answers`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                questionId: firstQuestionId,
                answerText: 'I would use a Hash Map to store the elements and look them up in O(1) time.',
                durationSecs: 30,
                fillerCount: 1
            })
        });
        data = await res.json();
        console.log("Answer response:", data.data);

        // 7. Test Transcribe Endpoint
        console.log("7. Testing Transcribe endpoint (sending dummy file)");
        // create dummy text file to act as audio
        fs.writeFileSync('dummy.wav', 'dummy audio data');
        
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fs.createReadStream('dummy.wav'));

        res = await fetch(`${baseUrl}/answers/transcribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });
        
        if (res.status === 200) {
            data = await res.json();
            console.log("Transcribe response:", data.data);
        } else {
             console.log("Transcribe failed (expected if dummy file is rejected by OpenAI):", res.status, await res.text());
        }

        console.log("Tests completed.");
    } catch (err) {
        console.error("Error during tests:", err);
    }
}

testApis();
