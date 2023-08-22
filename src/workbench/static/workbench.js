
const loaderUrl = '../../../node_modules/monaco-editor/min/vs/loader.js';

function loadMonaco() {

    const requireConfig = { paths: { 'vs': '../../../node_modules/monaco-editor/min/vs' } };

    // 执行 Loader，加载其他 Mono Editor scripts，并将编辑器绑定到 DOM 元素上。
    require.config(requireConfig);

    require(['vs/editor/editor.main'], () => {
        var editorDom = document.getElementById('editor');


        var options = {
            value: '// 在此处输入您的代码',
            language: 'javascript',
            theme:"vs-dark"
        };

        // 创建编辑器实例，并将其挂载到指定 dom 元素上
        const myEditor = monaco.editor.create(editorDom, options);
    });
}

loadMonaco()
