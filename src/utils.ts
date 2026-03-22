import Quill from 'quill';

export function deltaToHtml(delta) {
  // 1. 创建隐藏的临时编辑器容器（避免渲染到页面）
  const tempEditor = document.createElement('div');
  tempEditor.style.display = 'none';
  document.body.appendChild(tempEditor);

  try {
    // 2. 初始化临时 Quill 实例（仅用于转换，不显示）
    const quill = new Quill(tempEditor, {
      theme: 'snow',
      modules: {
        toolbar: false // 禁用工具栏，提升性能
      }
    });

    // 3. 将 Delta 内容设置到临时编辑器
    quill.setContents(delta);

    // 4. 获取编辑器渲染后的 HTML（核心步骤）
    const html = tempEditor.querySelector('.ql-editor').innerHTML;

    return html;
  } catch (error) {
    console.error('Delta 转 HTML 失败：', error);
    return '';
  } finally {
    // 5. 清理临时元素，避免内存泄漏
    document.body.removeChild(tempEditor);
  }
}