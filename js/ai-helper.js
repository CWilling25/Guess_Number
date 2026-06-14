// API配置 - 请替换为你的实际API Key
const HARDCODED_API_KEY = "sk-kgrbiyvjiosaeafigqmdudravnxlmtfwlqyrjrqbwmeftpiq";

function getApiKey() {
    if (HARDCODED_API_KEY && HARDCODED_API_KEY.trim()) {
        return HARDCODED_API_KEY;
    }
    try {
        const stored = localStorage.getItem("sf_api_key_learning_helper");
        if (stored && stored.trim()) return stored.trim();
    } catch (e) { }
    if (typeof showToast === 'function') {
        showToast("⚠️ 请先配置 API Key", 3000);
    }
    return "";
}

async function callSiliconFlow(apiKey, question) {
    const url = "https://api.siliconflow.cn/v1/chat/completions";
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };
    const data = {
        model: "THUDM/GLM-4-9B-0414",
        messages: [
            { role: "system", content: "你是一位专业的Python编程导师，擅长讲解while循环、随机数、基础语法等。请用清晰、简洁、有示例的方式回答学生的编程问题。回答要友好且富有教育意义。" },
            { role: "user", content: question }
        ],
        enable_thinking: false,
        temperature: 0.7,
        max_tokens: 800
    };
    
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(30000)
        }).then(async res => {
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errText.substring(0, 100)}`);
            }
            const json = await res.json();
            const answer = json?.choices?.[0]?.message?.content;
            if (answer) resolve(answer);
            else reject(new Error("AI返回内容为空"));
        }).catch(err => reject(err));
    });
}

async function askAI(question) {
    if (!question.trim()) throw new Error("问题不能为空");
    let apiKey = getApiKey();
    if (!apiKey) throw new Error("未设置API Key，请在代码中配置 HARDCODED_API_KEY");
    return await callSiliconFlow(apiKey, question);
}

async function handleAskAI() {
    const questionInput = document.getElementById('aiQuestionInput');
    const question = questionInput.value.trim();
    const responseDiv = document.getElementById('aiResponseArea');
    
    if (!question) {
        responseDiv.innerHTML = "⚠️ 请输入你要问的问题～";
        return;
    }
    
    responseDiv.innerHTML = '<div><span class="loading-spinner"></span> AI 思考中...</div>';
    
    try {
        const answer = await askAI(question);
        responseDiv.innerHTML = `<i class="fas fa-graduation-cap" style="margin-right:6px;"></i> ${answer.replace(/\n/g, '<br>')}`;
    } catch (err) {
        console.error(err);
        responseDiv.innerHTML = `❌ 请求失败: ${err.message}<br>请检查API Key是否正确，或网络是否通畅。`;
    }
}

// 绑定AI按钮事件
document.addEventListener('DOMContentLoaded', function() {
    const askBtn = document.getElementById('askAiBtn');
    if (askBtn) {
        askBtn.addEventListener('click', handleAskAI);
    }
});

window.askAI = askAI;
window.handleAskAI = handleAskAI;