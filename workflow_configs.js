// ==========================================
// 工作流配置库相关逻辑 (Workflow Configs)
// ==========================================

// Mock Data - Workflow Templates
const wfTemplateData = [
    {
        id: 'TPL-001',
        name: '标准全案生成流',
        version: 'V1.0.0',
        definition: '{"nodes":[{"id":"node1","type":"demand"},{"id":"node2","type":"lyrics"}],"edges":[{"source":"node1","target":"node2"}]}',
        changelog: '初始版本发布，包含基础全案生成节点。',
        status: '正常',
        creator: '系统管理员',
        createTime: '2026-05-18 10:00:00'
    },
    {
        id: 'TPL-002',
        name: '快速Beat混音流',
        version: 'V1.1.2',
        definition: '{"nodes":[{"id":"n1","type":"beat"},{"id":"n2","type":"mix"}],"edges":[{"source":"n1","target":"n2"}]}',
        changelog: '优化了Beat节点的输入参数结构。',
        status: '正常',
        creator: '张三',
        createTime: '2026-05-19 14:30:00'
    },
    {
        id: 'TPL-003',
        name: '人工介入作词流',
        version: 'V2.0.0',
        definition: '{"nodes":[{"id":"start","type":"demand"},{"id":"manual","type":"human_lyrics"}],"edges":[]}',
        changelog: '新增人工节点配置支持。',
        status: '已禁用',
        creator: '李四',
        createTime: '2026-05-20 09:15:00'
    }
];

// Mock Data - Workflow Instances (Maintenance)
const wfMaintenanceData = [
    {
        id: 'WF-1001',
        tplId: 'TPL-001',
        tplName: '标准全案生成流',
        name: '流行男声通用工作流',
        nodesCount: 5,
        version: 'V1.0.0',
        changelog: '绑定了流行男声专用的词曲配置。',
        status: '正常',
        creator: '王经理',
        createTime: '2026-05-18 11:20:00'
    },
    {
        id: 'WF-1002',
        tplId: 'TPL-002',
        tplName: '快速Beat混音流',
        name: '电子舞曲快速流',
        nodesCount: 3,
        version: 'V1.1.2',
        changelog: '更新混音节点配置。',
        status: '正常',
        creator: '张三',
        createTime: '2026-05-19 15:45:00'
    }
];

// 初始化工作流页面
function initWfPage() {
    renderWfMainTable();
    renderWfTplTable();
}

// 切换Tab
function switchWfTab(tab) {
    const tabs = document.querySelectorAll('#wfTabsContainer .tab-item');
    if (!tabs.length) return;
    tabs.forEach(t => t.classList.remove('active'));
    
    document.getElementById('wfMaintenanceArea').style.display = 'none';
    document.getElementById('wfTemplateArea').style.display = 'none';

    if (tab === 'maintenance') {
        tabs[0].classList.add('active');
        tabs[0].style.borderBottomColor = 'var(--primary)';
        tabs[0].style.color = 'var(--primary)';
        tabs[1].style.borderBottomColor = 'transparent';
        tabs[1].style.color = 'var(--gray-600)';
        document.getElementById('wfMaintenanceArea').style.display = 'flex';
    } else {
        tabs[1].classList.add('active');
        tabs[1].style.borderBottomColor = 'var(--primary)';
        tabs[1].style.color = 'var(--primary)';
        tabs[0].style.borderBottomColor = 'transparent';
        tabs[0].style.color = 'var(--gray-600)';
        document.getElementById('wfTemplateArea').style.display = 'flex';
    }
}

// ---------------- 工作流维护 (Main) ----------------
function renderWfMainTable(data = wfMaintenanceData) {
    const tbody = document.getElementById('wfMainBody');
    const emptyState = document.getElementById('wfMainEmpty');
    const tableDiv = document.querySelector('#wfMaintenanceArea .table-container');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tableDiv.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    tableDiv.style.display = 'block';
    emptyState.style.display = 'none';

    data.forEach(item => {
        const tr = document.createElement('tr');
        const statusBadge = item.status === '正常' 
            ? `<span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);">${item.status}</span>`
            : `<span class="badge" style="border: 1px solid var(--gray-400); color: var(--gray-600); background: var(--gray-100);">${item.status}</span>`;

        tr.innerHTML = `
            <td style="color: var(--gray-500);">${item.id}</td>
            <td style="color: var(--gray-600);">${item.tplName}</td>
            <td style="font-weight: 600; color: var(--gray-900);">${item.name}</td>
            <td>${item.nodesCount} 节点</td>
            <td><span class="badge" style="background: var(--gray-100); color: var(--gray-700);">${item.version}</span></td>
            <td style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.changelog}">${item.changelog}</td>
            <td id="wf-main-status-${item.id}">${statusBadge}</td>
            <td>${item.creator}</td>
            <td style="color: var(--gray-500);">${item.createTime}</td>
            <td class="sticky-right" style="text-align: center;">
                <button class="btn-text" onclick="openWfWizard('edit', '${item.id}')">详情</button>
                <button class="btn-text danger" id="wf-main-btn-${item.id}" onclick="toggleWfMainStatus('${item.id}')">${item.status === '正常' ? '禁用' : '启用'}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function doWfMainSearch() {
    const loading = document.getElementById('wfMainTableLoading');
    if (loading) loading.style.display = 'flex';
    
    setTimeout(() => {
        const tplName = document.getElementById('wf_searchMainTemplate').value.toLowerCase();
        const wfName = document.getElementById('wf_searchMainWorkflow').value.toLowerCase();
        const status = document.getElementById('wf_searchMainStatus').value;

        const filtered = wfMaintenanceData.filter(d => {
            const matchTpl = !tplName || d.tplName.toLowerCase().includes(tplName);
            const matchWf = !wfName || d.name.toLowerCase().includes(wfName);
            const matchStatus = !status || status === '全部' || d.status === status;
            return matchTpl && matchWf && matchStatus;
        });
        renderWfMainTable(filtered);
        if (loading) loading.style.display = 'none';
    }, 300);
}

function resetWfMainSearch() {
    document.getElementById('wf_searchMainTemplate').value = '';
    document.getElementById('wf_searchMainWorkflow').value = '';
    document.getElementById('wf_searchMainStatus').value = '';
    renderWfMainTable();
}

function toggleWfMainStatus(id) {
    const item = wfMaintenanceData.find(d => d.id === id);
    if (!item) return;
    
    // 如果是启用，需要检查引用的模版是否被禁用
    if (item.status === '已禁用') {
        const tpl = wfTemplateData.find(t => t.id === item.tplId);
        if (tpl && tpl.status === '已禁用') {
            alert('启用失败：该工作流引用的模版（' + tpl.name + '）已被禁用。请先启用模版。');
            return;
        }
    }

    const action = item.status === '正常' ? '禁用' : '启用';
    openConfirmDialog(`确认${action}`, `是否确认${action}工作流配置：${item.name}？`, '确认', item.status === '正常', () => {
        item.status = item.status === '正常' ? '已禁用' : '正常';
        renderWfMainTable();
    });
}

// ---------------- 工作流模版 (Template) ----------------
function renderWfTplTable(data = wfTemplateData) {
    const tbody = document.getElementById('wfTplBody');
    const emptyState = document.getElementById('wfTplEmpty');
    const tableDiv = document.querySelector('#wfTemplateArea .table-container');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tableDiv.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    tableDiv.style.display = 'block';
    emptyState.style.display = 'none';

    data.forEach(item => {
        const tr = document.createElement('tr');
        const statusBadge = item.status === '正常' 
            ? `<span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);">${item.status}</span>`
            : `<span class="badge" style="border: 1px solid var(--gray-400); color: var(--gray-600); background: var(--gray-100);">${item.status}</span>`;

        tr.innerHTML = `
            <td style="color: var(--gray-500);">${item.id}</td>
            <td style="font-weight: 600; color: var(--gray-900);">${item.name}</td>
            <td><span class="badge" style="background: var(--gray-100); color: var(--gray-700);">${item.version}</span></td>
            <td><span class="json-badge" onclick="alert('查看JSON结构:\\n\\n' + JSON.stringify(JSON.parse('${item.definition.replace(/'/g, "\\'")}'), null, 2))">JSON定义</span></td>
            <td style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.changelog}">${item.changelog}</td>
            <td id="wf-tpl-status-${item.id}">${statusBadge}</td>
            <td>${item.creator}</td>
            <td style="color: var(--gray-500);">${item.createTime}</td>
            <td class="sticky-right" style="text-align: center;">
                <button class="btn-text" onclick="openWfTemplateDrawer('edit', '${item.id}')">编辑</button>
                <button class="btn-text danger" onclick="toggleWfTplStatus('${item.id}')">${item.status === '正常' ? '禁用' : '启用'}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function doWfTemplateSearch() {
    const loading = document.getElementById('wfTplTableLoading');
    if (loading) loading.style.display = 'flex';
    
    setTimeout(() => {
        const name = document.getElementById('wf_searchName').value.toLowerCase();
        const version = document.getElementById('wf_searchVersion').value.toLowerCase();
        const status = document.getElementById('wf_searchStatus').value;

        const filtered = wfTemplateData.filter(d => {
            const matchName = !name || d.name.toLowerCase().includes(name);
            const matchVer = !version || d.version.toLowerCase().includes(version);
            const matchStatus = !status || status === '全部' || d.status === status;
            return matchName && matchVer && matchStatus;
        });
        renderWfTplTable(filtered);
        if (loading) loading.style.display = 'none';
    }, 300);
}

function resetWfTemplateSearch() {
    document.getElementById('wf_searchName').value = '';
    document.getElementById('wf_searchVersion').value = '';
    document.getElementById('wf_searchStatus').value = '';
    renderWfTplTable();
}

function toggleWfTplStatus(id) {
    const item = wfTemplateData.find(d => d.id === id);
    if (!item) return;
    const action = item.status === '正常' ? '禁用' : '启用';
    
    let extraMsg = '';
    if (item.status === '正常') {
        const affectedCount = wfMaintenanceData.filter(w => w.tplId === id && w.status === '正常').length;
        if (affectedCount > 0) {
            extraMsg = `\n\n⚠️ 警告：该模版正被 ${affectedCount} 个活跃的工作流实例引用。禁用模版可能导致相关工作流调度失败！`;
        }
    }

    openConfirmDialog(`确认${action}`, `是否确认${action}工作流模版：${item.name}？${extraMsg}`, '确认', item.status === '正常', () => {
        item.status = item.status === '正常' ? '已禁用' : '正常';
        renderWfTplTable();
    });
}

// ---------------- 模版抽屉逻辑 ----------------
function openWfTemplateDrawer(mode, id = null) {
    const overlay = document.getElementById('wfTemplateDrawerOverlay');
    const drawer = document.getElementById('wfTemplateDrawer');
    if (!overlay || !drawer) return;

    document.getElementById('wfTemplateDrawerTitle').innerText = mode === 'add' ? '新增工作流模版' : '编辑工作流模版';
    
    if (mode === 'add') {
        document.getElementById('wf_inputTplName').value = '';
        document.getElementById('wf_inputTplVersion').value = '';
        document.getElementById('wf_inputTplStatus').value = '正常';
        document.getElementById('wf_inputTplCreator').value = '当前用户';
        document.getElementById('wf_inputTplCreateTime').value = new Date().toLocaleString();
        document.getElementById('wf_inputTplChangelog').value = '';
        document.getElementById('wf_inputTplDefinition').value = '';
    } else if (mode === 'edit' && id) {
        const item = wfTemplateData.find(d => d.id === id);
        if (item) {
            document.getElementById('wf_inputTplName').value = item.name;
            document.getElementById('wf_inputTplVersion').value = item.version;
            document.getElementById('wf_inputTplStatus').value = item.status;
            document.getElementById('wf_inputTplCreator').value = item.creator;
            document.getElementById('wf_inputTplCreateTime').value = item.createTime;
            document.getElementById('wf_inputTplChangelog').value = item.changelog;
            document.getElementById('wf_inputTplDefinition').value = JSON.stringify(JSON.parse(item.definition), null, 2);
        }
    }

    overlay.style.display = 'flex';
    setTimeout(() => drawer.classList.add('active'), 10);
}

function closeWfTemplateDrawer() {
    const drawer = document.getElementById('wfTemplateDrawer');
    const overlay = document.getElementById('wfTemplateDrawerOverlay');
    if (drawer) drawer.classList.remove('active');
    setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 300);
}

function submitWfTemplateForm() {
    // 模拟保存
    closeWfTemplateDrawer();
}


// ---------------- 向导 (Wizard) 逻辑 ----------------
let currentWfWizardStep = 0;
let totalWfWizardSteps = 1;
const wizardNodeStepsData = [
    { type: 'demand', name: '需求节点' },
    { type: 'lyrics', name: '歌词生成节点' },
    { type: 'beat', name: 'Beat生成节点' },
    { type: 'vocal', name: '人声生成节点' },
    { type: 'mix', name: '混音节点' }
];

function openWfWizard(mode, id = null) {
    const overlay = document.getElementById('wfWizardOverlay');
    const modal = document.getElementById('wfWizardModal');
    if (!overlay || !modal) return;

    document.getElementById('wfWizardTitle').innerText = mode === 'add' ? '新增工作流配置' : '查看/编辑工作流配置';
    
    // 1 个基础信息步骤 + N 个节点绑定步骤
    totalWfWizardSteps = 1 + wizardNodeStepsData.length;
    currentWfWizardStep = 0;
    
    buildWizardSteps();
    updateWizardUI();

    // 回填数据
    if (mode === 'edit' && id) {
        const item = wfMaintenanceData.find(d => d.id === id);
        if (item) {
            setTimeout(() => {
                const nameInput = document.getElementById('wizard_wfName');
                const tplSelect = document.getElementById('wizard_tplSelect');
                const changelogInput = document.getElementById('wizard_wfChangelog');
                if (nameInput) nameInput.value = item.name;
                if (tplSelect) {
                    tplSelect.value = item.tplId;
                    tplSelect.disabled = true; // 编辑时不可修改模版
                }
                if (changelogInput) changelogInput.value = item.changelog;
            }, 50);
        }
    }

    overlay.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeWfWizard() {
    const modal = document.getElementById('wfWizardModal');
    const overlay = document.getElementById('wfWizardOverlay');
    if (modal) modal.classList.remove('active');
    setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 300);
}

function buildWizardSteps() {
    const track = document.getElementById('wfWizardTrack');
    if (!track) return;
    track.innerHTML = '';
    // Let track naturally size to 100% and overflow its children

    // Step 1: 基础信息
    const step1 = document.createElement('div');
    step1.className = 'wizard-step';
    
    let tplOptions = wfTemplateData.filter(t => t.status === '正常').map(t => `<option value="${t.id}">${t.name} (${t.version})</option>`).join('');
    
    step1.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; width: 100%;">
            <h3 style="margin-bottom: 24px;">工作流基础信息</h3>
            <div class="form-group">
                <label>选择工作流模版 <span style="color:var(--danger)">*</span></label>
                <select class="input" id="wizard_tplSelect" onchange="alert('切换模版将重置后续节点的绑定步骤')">
                    ${tplOptions}
                </select>
                <div style="font-size:12px; color:var(--gray-500); margin-top:6px;">将根据选中的模版自动生成后续配置步骤。</div>
            </div>
            <div class="form-group">
                <label>工作流实例名称 <span style="color:var(--danger)">*</span></label>
                <input type="text" class="input" id="wizard_wfName" placeholder="例如：流行男声标准工作流">
            </div>
            <div class="form-group">
                <label>变更日志 <span style="color:var(--danger)">*</span></label>
                <textarea class="input" id="wizard_wfChangelog" style="min-height:80px;" placeholder="记录配置修改内容"></textarea>
            </div>
        </div>
    `;
    track.appendChild(step1);

    // Step N: 节点绑定
    wizardNodeStepsData.forEach((node, idx) => {
        const step = document.createElement('div');
        step.className = 'wizard-step';
        
        step.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <h3 style="margin-bottom: 8px;">配置映射：${node.name}</h3>
                <p style="color: var(--gray-600); font-size: 13px; margin-bottom: 20px;">请从左侧配置库中选择需要绑定到当前节点的具体配置实例。</p>
                <div class="transfer-box">
                    <div class="transfer-panel">
                        <div class="transfer-header">
                            <span>待选配置库 (${node.name})</span>
                        </div>
                        <div class="transfer-search">
                            <input type="text" class="input" style="padding: 6px 10px;" placeholder="搜索配置名或标签...">
                        </div>
                        <div class="transfer-list">
                            <div class="transfer-item">
                                <div><span style="font-weight:500;">通用配置_V1</span> <span style="color:var(--gray-500); font-size:12px;">ID:1001</span></div>
                                <button class="btn-text" onclick="alert('已添加')"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="transfer-item">
                                <div><span style="font-weight:500;">流行女声专用</span> <span style="color:var(--gray-500); font-size:12px;">ID:1002</span></div>
                                <button class="btn-text" onclick="alert('已添加')"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: center; color: var(--gray-400); font-size: 20px;">
                        <i class="fas fa-arrow-right"></i>
                    </div>

                    <div class="transfer-panel">
                        <div class="transfer-header">
                            <span>已绑定配置 (支持多选轮询)</span>
                            <span style="color:var(--primary); cursor:pointer;" onclick="alert('清空')">清空</span>
                        </div>
                        <div class="transfer-list" style="background: var(--gray-50);">
                            <div class="transfer-item" style="background:#fff; border:1px solid var(--primary); border-radius:4px; margin:8px;">
                                <div><span style="font-weight:500; color:var(--primary);">通用配置_V1</span></div>
                                <button class="btn-text danger" onclick="alert('移除')"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        track.appendChild(step);
    });
}

function updateWizardUI() {
    const track = document.getElementById('wfWizardTrack');
    const prevBtn = document.getElementById('wf_btnWizardPrev');
    const nextBtn = document.getElementById('wf_btnWizardNext');
    const progressFill = document.getElementById('wfWizardProgressBar');
    const stepLabel = document.getElementById('wfWizardStepLabel');
    const stepDesc = document.getElementById('wfWizardStepDesc');

    if (!track) return;

    // 滑动动画 (translateX is relative to the track's own width. Since we let track width=100% of viewport, we translate by -100% per step)
    const pct = -(currentWfWizardStep * 100);
    track.style.transform = `translateX(${pct}%)`;

    // 进度条
    const progressPct = ((currentWfWizardStep + 1) / totalWfWizardSteps) * 100;
    progressFill.style.width = `${progressPct}%`;

    // 文本更新
    stepLabel.innerText = `步骤 ${currentWfWizardStep + 1}/${totalWfWizardSteps}`;
    if (currentWfWizardStep === 0) {
        stepDesc.innerText = '配置基本信息';
    } else {
        stepDesc.innerText = `绑定节点：${wizardNodeStepsData[currentWfWizardStep - 1].name}`;
    }

    // 按钮显隐与文案
    prevBtn.style.visibility = currentWfWizardStep === 0 ? 'hidden' : 'visible';
    if (currentWfWizardStep === totalWfWizardSteps - 1) {
        nextBtn.innerText = '完成并保存';
        nextBtn.classList.add('success');
    } else {
        nextBtn.innerText = '下一步';
        nextBtn.classList.remove('success');
    }
}

function wfWizardNext() {
    if (currentWfWizardStep < totalWfWizardSteps - 1) {
        currentWfWizardStep++;
        updateWizardUI();
    } else {
        closeWfWizard();
        alert('工作流配置保存成功！');
    }
}

function wfWizardPrev() {
    if (currentWfWizardStep > 0) {
        currentWfWizardStep--;
        updateWizardUI();
    }
}

// ---------------- 导出弹窗 ----------------
function openWfExportModal() {
    openModal('wfExportModal');
    onWfExportTypeChange();
}

function closeWfExportModal() {
    closeModal('wfExportModal');
}

function onWfExportTypeChange() {
    const isTemplate = document.querySelector('input[name="wfExportType"][value="template"]').checked;
    const targetSelect = document.getElementById('wf_exportTargetSelect');
    if (!targetSelect) return;
    
    targetSelect.innerHTML = '';
    
    if (isTemplate) {
        wfTemplateData.forEach(t => {
            targetSelect.innerHTML += `<option value="${t.id}">${t.name} (${t.version})</option>`;
        });
    } else {
        wfMaintenanceData.forEach(w => {
            targetSelect.innerHTML += `<option value="${w.id}">${w.name} (${w.tplName})</option>`;
        });
    }
    onWfExportTargetChange();
}

function onWfExportTargetChange() {
    const countSpan = document.getElementById('wf_exportDataCount');
    if (countSpan) {
        // 随机模拟行数
        countSpan.innerText = Math.floor(Math.random() * 5000) + 100;
    }
}

function confirmWfExport() {
    const isTemplate = document.querySelector('input[name="wfExportType"][value="template"]').checked;
    const targetSelect = document.getElementById('wf_exportTargetSelect');
    const targetName = targetSelect.options[targetSelect.selectedIndex].text;
    
    const typeLabel = isTemplate ? '模版' : '实例';
    
    const csvContent = "\uFEFF订单编号,批次编号,流水线ID,节点状态,开始时间,结束时间\n" + 
                       "OD-1001,BATCH-01,PL-991,已完成,2026-05-18 10:00,2026-05-18 12:00\n" +
                       "OD-1002,BATCH-01,PL-992,进行中,2026-05-18 10:30, - \n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${typeLabel}_${targetName.replace(/\s/g, '_')}_运行数据.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    closeWfExportModal();
}
