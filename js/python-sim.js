// python-sim.js - 使用 AI（DeepSeek）执行 Python 代码
// 注意：AI 并非真正的解释器，对于 input() 会自动模拟输入，循环会正确执行但速度较慢

// 获取 AI 回答的通用函数（如果 common.js 的 askAI 不可用，则自己实现）
async function callAI(prompt) {
    // 尝试使用全局的 askAI（来自 common.js）
    if (typeof window.askAI === 'function') {
        // askAI 返回的是 promise，但 common.js 中的 askAI 是直接操作 DOM 的，我们这里需要获取纯文本
        // 为了简单，我们自己实现 fetch
    }
    
    // 直接使用 fetch 调用 API（与 common.js 中的密钥一致）
    const API_KEY = "sk-kgrbiyvjiosaeafigqmdudravnxlmtfwlqyrjrqbwmeftpiq";
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "THUDM/GLM-4-9B-0414",
            messages: [
                { role: "system", content: "你是一个 Python 解释器。用户会提供 Python 代码，你需要模拟执行并只输出程序的运行结果（可能会有错误，你就模拟pyhon输出错误），不要输出任何解释、不要输出额外的文字。对于 input()，请自动模拟一个合理的输入（比如猜数字游戏时，你可以依次模拟猜测 50、25、... 直到猜中，或者直接模拟猜中）。只输出 print 的内容，不要输出其他。" },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1500
        })
    });
    const json = await response.json();
    const answer = json?.choices?.[0]?.message?.content || "执行出错，请重试。";
    return answer;
}

// 运行 Python 代码（通过 AI）
async function runPythonCode(code) {
    let outputDiv = document.querySelector('.output-box');
    if (!outputDiv) {
        outputDiv = document.createElement('div');
        outputDiv.className = 'output-box';
        outputDiv.style.cssText = 'background:#0a0c10; color:#c9d1d9; padding:14px; border-radius:12px; margin:16px; font-family:monospace;';
        document.body.appendChild(outputDiv);
    }
    
    outputDiv.innerHTML = ">> 正在自动 执行代码...\n";
    
    try {
        // 构建 prompt：要求 AI 执行代码并返回输出
        const prompt = `请执行以下 Python 代码，并只输出程序运行后的结果（不要输出其他任何内容）：\n\`\`\`python\n${code}\n\`\`\``;
        const result = await callAI(prompt);
        outputDiv.innerHTML = result || "程序执行完毕，无输出。";
    } catch (err) {
        outputDiv.innerHTML = `自动执行错误: ${err.message}`;
    }
    
    return outputDiv.innerHTML;
}

// 保留原有的 createHighlighterEditor（高亮编辑器）不变
window.createHighlighterEditor = function(initialCode, hintText) {
    const container = document.createElement('div');
    container.className = 'code-card';

    const wrapper = document.createElement('div');
    wrapper.className = 'code-editor-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.overflow = 'auto';

    const pre = document.createElement('pre');
    pre.className = 'highlight-pre';
    pre.style.position = 'absolute';
    pre.style.top = '0';
    pre.style.left = '0';
    pre.style.width = '100%';
    pre.style.height = '100%';
    pre.style.margin = '0';
    pre.style.padding = '16px';
    pre.style.overflow = 'auto';
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.wordBreak = 'break-word';
    pre.style.fontFamily = "'Fira Code', monospace";
    pre.style.fontSize = '13px';
    pre.style.lineHeight = '1.5';
    pre.style.pointerEvents = 'none';
    pre.style.backgroundColor = '#0d1117';

    const codeElem = document.createElement('code');
    codeElem.className = 'language-python';
    pre.appendChild(codeElem);

    const ta = document.createElement('textarea');
    ta.className = 'code-textarea';
    ta.spellcheck = false;
    ta.value = initialCode;
    ta.style.position = 'relative';
    ta.style.width = '100%';
    ta.style.minHeight = '300px';
    ta.style.padding = '16px';
    ta.style.margin = '0';
    ta.style.border = 'none';
    ta.style.outline = 'none';
    ta.style.backgroundColor = 'transparent';
    ta.style.color = 'transparent';
    ta.style.caretColor = '#e6edf3';
    ta.style.fontFamily = "'Fira Code', monospace";
    ta.style.fontSize = '13px';
    ta.style.lineHeight = '1.5';
    ta.style.whiteSpace = 'pre-wrap';
    ta.style.wordBreak = 'break-word';
    ta.style.overflow = 'auto';
    ta.style.resize = 'vertical';

    wrapper.appendChild(pre);
    wrapper.appendChild(ta);

    function syncHighlight() {
        codeElem.textContent = ta.value;
        if (typeof hljs !== 'undefined') hljs.highlightElement(codeElem);
    }
    function syncScroll() {
        pre.scrollTop = ta.scrollTop;
        pre.scrollLeft = ta.scrollLeft;
    }
    ta.addEventListener('input', syncHighlight);
    ta.addEventListener('scroll', syncScroll);
    syncHighlight();

    const bar = document.createElement('div');
    bar.className = 'action-bar';
    const runBtn = document.createElement('button');
    runBtn.className = 'run-btn';
    runBtn.innerHTML = '<i class="fas fa-play"></i> 运行代码';
    const hintSpan = document.createElement('span');
    hintSpan.style.fontSize = '11px';
    hintSpan.style.color = '#8b949e';
    hintSpan.textContent = hintText || '💡 代码将自动执行（模拟运行）';
    bar.appendChild(runBtn);
    bar.appendChild(hintSpan);

    const outDiv = document.createElement('div');
    outDiv.className = 'output-box';
    outDiv.textContent = '[点击运行] 代码将自动执行，结果将显示在这里。';

    container.appendChild(wrapper);
    container.appendChild(bar);
    container.appendChild(outDiv);

    runBtn.addEventListener('click', async () => {
        outDiv.innerHTML = ">>  执行中...\n";
        try {
            const res = await runPythonCode(ta.value);
            outDiv.innerHTML = res;
        } catch (e) {
            outDiv.innerHTML = `执行异常: ${e.message}`;
        }
    });

    return container;
};

// 导出
window.runPythonCode = runPythonCode;