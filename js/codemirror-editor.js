// CodeMirror 编辑器封装
class CodeMirrorEditor {
    constructor(container, initialCode, options = {}) {
        this.container = container;
        this.initialCode = initialCode;
        this.options = {
            lineNumbers: true,
            mode: 'python',
            theme: 'dracula',
            indentUnit: 4,
            smartIndent: true,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            ...options
        };
        this.editor = null;
        this.outputDiv = null;
        this.init();
    }

    init() {
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'code-card';
        
        // 创建编辑器容器
        const editorContainer = document.createElement('div');
        editorContainer.id = `codemirror-${Date.now()}-${Math.random()}`;
        
        wrapper.appendChild(editorContainer);
        
        // 创建按钮栏
        const bar = document.createElement('div');
        bar.className = 'action-bar';
        bar.style.cssText = 'padding: 10px 16px; background: #161b22; border-top: 1px solid #30363d; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;';
        
        const runBtn = document.createElement('button');
        runBtn.className = 'run-btn';
        runBtn.innerHTML = '<i class="fas fa-play"></i> 运行代码';
        runBtn.style.cssText = 'background: #238636; border: none; color: white; padding: 6px 20px; border-radius: 30px; cursor: pointer; font-size: 13px;';
        
        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i> 重置';
        resetBtn.style.cssText = 'background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 6px 20px; border-radius: 30px; cursor: pointer; font-size: 13px;';
        
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制';
        copyBtn.style.cssText = 'background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 6px 20px; border-radius: 30px; cursor: pointer; font-size: 13px;';
        
        const hintSpan = document.createElement('span');
        hintSpan.style.cssText = 'font-size: 11px; color: #8b949e;';
        hintSpan.textContent = this.options.hintText || '💡 实时语法高亮，支持Python代码编辑';
        
        bar.appendChild(runBtn);
        bar.appendChild(resetBtn);
        bar.appendChild(copyBtn);
        bar.appendChild(hintSpan);
        
        // 创建输出框
        this.outputDiv = document.createElement('div');
        this.outputDiv.className = 'output-box';
        this.outputDiv.style.cssText = 'background: #0a0c10; color: #c9d1d9; padding: 14px 18px; border-radius: 12px; font-family: monospace; font-size: 0.75rem; margin: 0 16px 16px 16px; border: 1px solid #2d333b; white-space: pre-wrap; max-height: 280px; overflow-y: auto;';
        this.outputDiv.textContent = '[点击运行] 程序将按顺序执行，遇到 input() 平台会自动模拟输入。';
        
        wrapper.appendChild(bar);
        wrapper.appendChild(this.outputDiv);
        this.container.appendChild(wrapper);
        
        // 初始化 CodeMirror
        this.editor = CodeMirror(document.getElementById(editorContainer.id), {
            value: this.initialCode,
            ...this.options
        });
        
        // 设置编辑器高度
        this.editor.setSize('100%', '350px');
        
        // 绑定事件
        runBtn.onclick = () => this.runCode();
        resetBtn.onclick = () => this.resetCode();
        copyBtn.onclick = () => this.copyCode();
        
        // 保存引用以便清理
        this.runBtn = runBtn;
        this.resetBtn = resetBtn;
        this.copyBtn = copyBtn;
    }
    
    async runCode() {
        const code = this.editor.getValue();
        this.outputDiv.innerHTML = ">> 运行中 ...\n";
        try {
            const res = await runPythonCode(code);
            this.outputDiv.innerHTML = res || "程序执行完毕，无输出内容。";
        } catch (e) {
            this.outputDiv.innerHTML = `执行异常: ${e.message}`;
        }
    }
    
    resetCode() {
        this.editor.setValue(this.initialCode);
        this.outputDiv.textContent = '[已重置] 代码已恢复初始状态。';
    }
    
    async copyCode() {
        const code = this.editor.getValue();
        try {
            await navigator.clipboard.writeText(code);
            this.showToast('✅ 代码已复制到剪贴板');
        } catch (err) {
            this.showToast('❌ 复制失败');
        }
    }
    
    showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position: fixed; bottom: 100px; right: 30px; background: #238636; color: white; padding: 8px 18px; border-radius: 40px; z-index: 9999; font-size: 13px; animation: fadeOut 2s forwards;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
    
    getValue() {
        return this.editor.getValue();
    }
    
    setValue(code) {
        this.editor.setValue(code);
    }
    
    destroy() {
        if (this.editor) {
            this.editor.toTextArea();
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 全局函数：创建编辑器
function createCodeMirrorEditor(container, initialCode, hintText = '') {
    if (!container) return null;
    
    // 清空容器
    container.innerHTML = '';
    
    // 确保 CodeMirror 已加载
    if (typeof CodeMirror === 'undefined') {
        container.innerHTML = '<div style="color:red; padding:20px;">CodeMirror 加载失败，请刷新页面重试。</div>';
        return null;
    }
    
    return new CodeMirrorEditor(container, initialCode, { hintText });
}

// 兼容旧函数名
window.createHighlighterEditor = function(initialCode, hintText) {
    const container = document.createElement('div');
    // 延迟创建，等待 DOM 准备
    setTimeout(() => {
        createCodeMirrorEditor(container, initialCode, hintText);
    }, 0);
    return container;
};