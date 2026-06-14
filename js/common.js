// 笔记功能
const NOTES_KEY = "python_course_notes";

function loadNotes() {
    const saved = localStorage.getItem(NOTES_KEY);
    const ta = document.getElementById('notesContent');
    if (ta) ta.value = saved || "";
}

function saveNotes() {
    const ta = document.getElementById('notesContent');
    if (ta) {
        localStorage.setItem(NOTES_KEY, ta.value);
        showToast("📘 笔记已保存", 1200);
    }
}

function downloadNotes() {
    const content = document.getElementById('notesContent')?.value || "";
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `python_notes_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("✅ 笔记已下载", 1200);
}

// AI助手 - 请替换为你自己的 API Key
const API_KEY = "sk-kgrbiyvjiosaeafigqmdudravnxlmtfwlqyrjrqbwmeftpiq";

async function askAI() {
    const question = document.getElementById('aiQuestionInput')?.value.trim();
    const responseDiv = document.getElementById('aiResponseArea');
    if (!question) {
        responseDiv.innerHTML = "⚠️ 请输入问题";
        return;
    }
    responseDiv.innerHTML = '<div><span class="loading-spinner"></span> AI思考中...</div>';
    try {
        const res = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "THUDM/GLM-4-9B-0414",
                messages: [
                    { role: "system", content: "你是Python编程导师，擅长讲解while循环、随机数等。回答要清晰、简洁、有示例。" },
                    { role: "user", content: question }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });
        const json = await res.json();
        const answer = json?.choices?.[0]?.message?.content || "无法获取回答";
        responseDiv.innerHTML = `<i class="fas fa-graduation-cap" style="margin-right:6px;"></i> ${answer.replace(/\n/g, '<br>')}`;
    } catch (err) {
        responseDiv.innerHTML = `❌ 请求失败: ${err.message}`;
    }
}

function showToast(msg, dur = 1500) {
    let t = document.createElement('div');
    t.innerText = msg;
    t.style.cssText = 'position:fixed; bottom:100px; right:30px; background:#2c6e9e; color:white; padding:8px 18px; border-radius:40px; z-index:3000; font-size:13px;';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), dur);
}

// 模态框控制
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// 初始化所有页面的公共元素
document.addEventListener('DOMContentLoaded', function() {
    // 绑定笔记按钮
    const noteBtn = document.getElementById('noteIconBtn');
    if (noteBtn) noteBtn.onclick = () => openModal('notesModal');

    const closeNotes = document.getElementById('closeNotesBtn');
    if (closeNotes) closeNotes.onclick = () => closeModal('notesModal');

    const saveBtn = document.getElementById('saveNotesBtn');
    if (saveBtn) saveBtn.onclick = saveNotes;

    const downloadBtn = document.getElementById('downloadNotesSummaryBtn');
    if (downloadBtn) downloadBtn.onclick = downloadNotes;

    // 绑定AI按钮
    const aiBtn = document.getElementById('aiIconBtn');
    if (aiBtn) aiBtn.onclick = () => openModal('aiModal');

    const closeAi = document.getElementById('closeAiBtn');
    if (closeAi) closeAi.onclick = () => closeModal('aiModal');

    const askBtn = document.getElementById('askAiBtn');
    if (askBtn) askBtn.onclick = askAI;

    // 点击背景关闭模态框
    const notesModal = document.getElementById('notesModal');
    if (notesModal) {
        notesModal.onclick = (e) => {
            if (e.target === notesModal) closeModal('notesModal');
        };
    }

    const aiModal = document.getElementById('aiModal');
    if (aiModal) {
        aiModal.onclick = (e) => {
            if (e.target === aiModal) closeModal('aiModal');
        };
    }

    loadNotes();
    if (typeof hljs !== 'undefined') hljs.configure({ tabReplace: '    ' });
});