// 页面路由与内容配置
const pages = {
    'workbench-page': {
        title: '工作台 (人工写词)',
        content: `
            <div class="content-wrapper" style="display: flex; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
                <div class="col-left" style="flex: 1; display: flex; flex-direction: column;">
                    <!-- 打回状态警告 (全局隐藏，通过打回状态触发) -->
                    <div id="rejectedAlert" style="display: none; background-color: #fff2f0; border: 1px solid #ffccc7; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; align-items: flex-start; gap: 12px;">
                        <div style="color: var(--danger); font-size: 16px; margin-top: 2px;">❌</div>
                        <div>
                            <div style="color: var(--danger); font-weight: 600; font-size: 14px; margin-bottom: 4px;">任务被打回重新修改</div>
                            <div style="color: rgba(0,0,0,0.65); font-size: 13px;">打回原因：副歌部分缺乏记忆点，且词风过于深沉，请根据上方要求的“年轻下沉”风格重新调整润色。</div>
                        </div>
                    </div>

                    <!-- 步骤导航条 -->
                    <div style="display: flex; gap: 32px; border-bottom: 1px solid var(--gray-200); margin-bottom: 24px; padding-bottom: 12px;">
                        <div id="tab1" onclick="switchStep(1)" style="font-size: 16px; font-weight: 600; color: var(--primary); cursor: pointer; border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: -13px;">1. 参考与配置生成</div>
                        <div id="tab2" onclick="switchStep(2)" style="font-size: 16px; font-weight: 500; color: var(--gray-600); cursor: pointer; padding-bottom: 10px; margin-bottom: -13px;">2. 结果润色与提交</div>
                    </div>

                    <!-- ================= 页面一：配置与生成 ================= -->
                    <div id="step1Content" style="display: flex; flex-direction: column; flex: 1;">
                        <!-- 原始参考区 -->
                        <div class="info-card">
                            <h4>📝 原始参考</h4>
                            <div style="display: flex; gap: 24px;">
                                <!-- 原版参考 -->
                                <div style="background: var(--gray-50); padding: 16px; border-radius: 8px; border: 1px solid var(--gray-200); flex: 1;">
                                    <div class="form-group" style="position: relative;">
                                        <label>对标歌名参考 (original_title)</label>
                                        <input type="text" value="《旧日时光》" readonly style="background: var(--gray-100); padding-right: 40px;">
                                        <span class="copy-icon" onclick="copyField(this, '《旧日时光》')" style="position: absolute; right: 10px; top: 35px; cursor: pointer; opacity: 0.6; font-size: 16px;">📋</span>
                                    </div>
                                    <div class="form-group" style="position: relative; margin-bottom: 0;">
                                        <label>对标歌词参考 (original_lyrics)</label>
                                        <textarea readonly style="min-height: 240px; background: var(--gray-100); resize: none; padding-right: 40px;">[Verse]
星空下许下约定
未来哪怕有风雨

[Chorus]
就算世界在改变
我会陪在你身边</textarea>
                                        <span class="copy-icon" onclick="copyField(this, '[Verse]\\n星空下许下约定\\n未来哪怕有风雨\\n\\n[Chorus]\\n就算世界在改变\\n我会陪在你身边')" style="position: absolute; right: 10px; top: 35px; cursor: pointer; opacity: 0.6; font-size: 16px;">📋</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- AI 生成配置区 -->
                        <div class="info-card">
                            <h4>🤖 AI 生成参数配置</h4>
                            
                            <div class="form-group" style="margin-bottom: 24px;">
                                <label style="font-weight: 600; color: var(--primary); font-size: 15px;">🌟 歌词写作模式</label>
                                <select id="lyricsModeSelect" style="font-size: 15px; padding: 10px; height: auto;" onchange="document.getElementById('aiConfigArea').style.display = this.value ? 'flex' : 'none'">
                                    <option value="">-- 请选择写作模式 --</option>
                                    <option value="grassland">草原风歌词写作</option>
                                    <option value="80s_golden">80金曲歌词写作</option>
                                </select>
                            </div>

                            <div id="aiConfigArea" style="display: none; gap: 24px;">
                                <!-- 系统参数 (不显示提示词) -->
                                <div style="flex: 1; background: var(--gray-50); padding: 16px; border-radius: 8px; border: 1px solid var(--gray-200);">
                                    <div style="display: flex; flex-direction: column; gap: 16px;">
                                        <div class="form-group" style="margin-bottom: 0;">
                                            <label style="font-size: 13px;">规避词 (avoidWords)</label>
                                            <input type="text" readonly value="脏话, 违禁词" style="font-size: 13px; background: var(--gray-100);">
                                        </div>
                                        <div class="form-group" style="margin-bottom: 0;">
                                            <label style="font-size: 13px;">生成数量</label>
                                            <input type="text" readonly value="2" style="font-size: 13px; background: var(--gray-100);">
                                        </div>
                                        <div class="form-group" style="margin-bottom: 0;">
                                            <label style="font-size: 13px;">格式要求 (format)</label>
                                            <input type="text" readonly value="4,4,4,4" style="font-size: 13px; background: var(--gray-100);">
                                        </div>
                                    </div>
                                </div>

                                <!-- 可编辑输入区 -->
                                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                                    <div>
                                        <div style="font-size: 13px; color: var(--primary); margin-bottom: 12px; font-weight: 500;">填词方向引导 (选填)</div>
                                        
                                        <div class="form-group" style="margin-bottom: 16px;">
                                            <label>金句 (goldenSentence)</label>
                                            <input type="text" id="goldenSentence" placeholder="例如：风吹过夏天的街道...">
                                        </div>
                                        
                                        <div style="display: flex; gap: 16px;">
                                            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                                                <label>意象 (imagery)</label>
                                                <input type="text" id="imagery" placeholder="例如：微风, 晚霞">
                                            </div>
                                            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                                                <label>韵脚 (rhyme)</label>
                                                <input type="text" id="rhyme" placeholder="例如：ao, an">
                                            </div>
                                        </div>
                                    </div>

                                    <button class="btn-primary" onclick="simulateGenerate()" style="width: 100%; height: 44px; font-size: 16px; margin-top: 24px; justify-content: center;">🚀 自动生成歌词</button>
                                </div>
                            </div>
                        </div>

                        <!-- 生成结果展示区 (默认隐藏) -->
                        <div class="info-card" id="generatedResultCard" style="display: none; border: 1px solid var(--primary); background: var(--primary-light);">
                            <h4 style="color: var(--primary); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(51,112,255,0.2);">
                                <span>✨ AI 生成结果</span>
                                <span style="font-size: 13px; font-weight: normal; color: var(--gray-600);">💡 提示：您可以选择符合要求的版本，并在下一页进行更改</span>
                            </h4>
                            
                            <div style="display: flex; gap: 16px; margin-top: 16px;">
                                <!-- Result 1 -->
                                <div class="form-group" style="flex: 1; margin-bottom: 0; position: relative;">
                                    <label>版本 1 (仅供参考复制)</label>
                                    <textarea id="generatedLyrics1" readonly style="min-height: 240px; background: #fff; cursor: copy; padding-right: 40px;"></textarea>
                                    <span class="copy-icon" id="copyGeneratedBtn1" onclick="copyField(this, '')" style="position: absolute; right: 10px; top: 35px; cursor: pointer; opacity: 0.6; font-size: 16px;">📋</span>
                                </div>
                                
                                <!-- Result 2 -->
                                <div class="form-group" style="flex: 1; margin-bottom: 0; position: relative;">
                                    <label>版本 2 (仅供参考复制)</label>
                                    <textarea id="generatedLyrics2" readonly style="min-height: 240px; background: #fff; cursor: copy; padding-right: 40px;"></textarea>
                                    <span class="copy-icon" id="copyGeneratedBtn2" onclick="copyField(this, '')" style="position: absolute; right: 10px; top: 35px; cursor: pointer; opacity: 0.6; font-size: 16px;">📋</span>
                                </div>
                            </div>
                        </div>

                        <!-- Step 1 底部操作栏 -->
                        <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: auto; padding: 16px 0;">
                            <button class="btn-default" style="color: var(--danger); border-color: var(--danger);" onclick="showAbortModal()">终止任务</button>
                            <button class="btn-primary" onclick="switchStep(2)">下一步：润色与提交 ➡️</button>
                        </div>
                    </div>

                    <!-- ================= 页面二：创作与提交 ================= -->
                    <div id="step2Content" style="display: none; flex-direction: column; flex: 1;">
                        <!-- 创作编辑区 -->
                        <div class="info-card" style="flex: 1; display: flex; flex-direction: column;" id="compositionCard">
                            <h4 style="color: var(--primary);">✍️ 最终创作区</h4>
                            
                            <div class="form-group">
                                <label>新歌名 (title) <span style="color: red;">*</span></label>
                                <input type="text" id="newTitle" placeholder="请输入创作的歌名..." value="《繁星下的约定》" oninput="validateInput()">
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0; flex: 1; display: flex; flex-direction: column;">
                                <label>新歌词 (lyrics) <span style="color: red;">*</span></label>
                                <textarea id="newLyrics" placeholder="点击第一页生成按钮获取 AI 歌词，或在此处直接进行人工填写与润色..." style="flex: 1; min-height: 350px; background: #fff;" oninput="validateInput()">[Verse]
繁星下我们许下约定
不管未来有多少风雨

[Chorus]
就算世界都在改变
我依然会陪在你身边</textarea>
                            </div>
                        </div>

                        <!-- Step 2 底部操作栏 -->
                        <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: auto; padding: 16px 0;">
                            <button class="btn-default" onclick="switchStep(1)">⬅️ 返回配置</button>
                            <button class="btn-default" style="color: var(--danger); border-color: var(--danger);" onclick="showAbortModal()">终止任务</button>
                            <button class="btn-primary" id="submitBtn" onclick="submitTask()">提交填写结果</button>
                        </div>
                    </div>
                </div>

                <div class="col-right" style="width: 340px; display: flex; flex-direction: column; gap: 24px; flex-shrink: 0;">
                    <div class="info-card">
                        <h4>业务信息</h4>
                        <div style="font-size: 14px; line-height: 1.6;">
                            <div style="display: flex;">
                                <div style="color: var(--gray-600); width: 80px; flex-shrink: 0;">风格要求</div>
                                <div style="color: var(--gray-900); flex: 1;"><span class="badge badge-blue">年轻下沉</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="info-card">
                        <h4>上下文信息</h4>
                        
                        <div style="margin-bottom: 16px;">
                            <div style="font-weight: 500; font-size: 14px; margin-bottom: 8px;">📋 任务说明</div>
                            <div style="padding: 12px 16px; border-radius: 6px; font-size: 13px; line-height: 1.5; background-color: var(--primary-light); color: var(--primary); border: 1px solid rgba(51,112,255,0.2);">
                                当前任务为人工写词环节。请参考左侧的原始歌词，结合右侧的风格要求与规范，在右侧编辑区进行新版歌词的创作与润色。
                            </div>
                        </div>

                        <div>
                            <div style="font-weight: 500; font-size: 14px; margin-bottom: 8px;">✅ 创作标准</div>
                            <ul style="font-size: 13px; color: var(--gray-600); padding-left: 16px; line-height: 1.8;">
                                <li>新词必须符合目标用户群体审美（如年轻下沉）。</li>
                                <li>注意压韵与节奏感，如果原曲为翻唱等模式，需保持字数相近。</li>
                                <li>不得包含违规违法或敏感词汇。</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `,
    },
    'lyrics-review-page': {
        title: '工作台 (歌词审核)',
        content: `
            <div class="content-wrapper" style="display: flex; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
                <div class="col-left" style="flex: 1; display: flex; flex-direction: column; gap: 24px;">
                    <!-- 审核内容卡片 -->
                    <div class="info-card" style="margin-bottom: 0;">
                        <h4>📝 审核内容</h4>
                        <div style="display: flex; gap: 24px;">
                            <!-- 原版参考 -->
                            <div style="flex: 1; background: var(--gray-50); padding: 16px; border-radius: 8px; border: 1px solid var(--gray-200);">
                                <div class="form-group">
                                    <label>原歌名参考</label>
                                    <input type="text" value="《旧日时光》" readonly style="background: var(--gray-100);">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label>原歌词参考</label>
                                    <textarea readonly style="min-height: 240px; background: var(--gray-100); resize: none;">[Verse]
星空下许下约定
未来哪怕有风雨

[Chorus]
就算世界在改变
我会陪在你身边

[Outro]
不分离</textarea>
                                </div>
                            </div>
                            
                            <!-- 待审内容 -->
                            <div style="flex: 1; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid var(--primary); box-shadow: 0 0 8px rgba(51,112,255,0.08);">
                                <div class="form-group">
                                    <label style="color: var(--primary); font-weight: 600;">待审核歌名</label>
                                    <input type="text" value="《繁星下的约定》" readonly style="border-color: var(--primary);">
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label style="color: var(--primary); font-weight: 600;">待审核歌词</label>
                                    <textarea readonly style="min-height: 240px; border-color: var(--primary); resize: none;">[Verse]
繁星下我们许下约定
不管未来有多少风雨

[Chorus]
就算世界都在改变
我依然会陪在你身边

[Outro]
永远不分离</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 写词人备注 -->
                        <div style="margin-top: 24px; border-top: 1px dashed var(--gray-300); padding-top: 16px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="color: var(--primary); font-weight: 600;">💡 写词人备注说明</label>
                                <div style="padding: 12px 16px; background: var(--primary-light); border-radius: 6px; border: 1px solid rgba(51,112,255,0.2); font-size: 13px; color: var(--gray-800); line-height: 1.6;">
                                    副歌部分为了迎合“年轻下沉”的风格，我重点修改了原歌词中过于深沉的表达，加入了更加直白的情绪和洗脑的韵脚，请审核。
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 审核操作卡片 -->
                    <div class="info-card" style="margin-bottom: 0;">
                        <h4>⚖️ 审核操作</h4>
                        <div class="form-group">
                            <label>审核评级 <span style="color: red;">*</span></label>
                            <select id="ratingSelect" onchange="handleRatingChange()" style="width: 50%;">
                                <option value="" disabled selected>请选择评级...</option>
                                <option value="S">S</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>

                        <div class="form-group" id="remarkContainer" style="display: none; margin-bottom: 0;">
                            <label id="remarkLabel">综合评语</label>
                            <textarea id="remarkInput" placeholder="请输入您的意见..." style="min-height: 80px;" oninput="validateReviewInput()"></textarea>
                        </div>

                        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 12px;">
                            <button class="btn-primary" id="submitReviewBtn" style="display: none;" onclick="submitReview()"></button>
                        </div>
                    </div>
                </div>

                <div class="col-right" style="width: 340px; display: flex; flex-direction: column; gap: 24px; flex-shrink: 0;">
                    <div class="info-card" style="margin-bottom: 0;">
                        <h4>业务信息</h4>
                        <div style="font-size: 14px; line-height: 1.6;">
                            <div style="display: flex;">
                                <div style="color: var(--gray-600); width: 80px; flex-shrink: 0;">风格要求</div>
                                <div style="color: var(--gray-900); flex: 1;"><span class="badge badge-blue">年轻下沉</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="info-card" style="margin-bottom: 0;">
                        <h4>上下文信息</h4>
                        
                        <div style="margin-bottom: 16px;">
                            <div style="font-weight: 500; font-size: 14px; margin-bottom: 8px;">📋 任务说明</div>
                            <div style="padding: 12px 16px; border-radius: 6px; font-size: 13px; line-height: 1.5; background-color: var(--primary-light); color: var(--primary); border: 1px solid rgba(51,112,255,0.2);">
                                当前任务为歌词审核环节。请仔细比对待审核歌词与原版歌词的差异，确保修改后的歌词依然符合整体意境 and 韵律要求。
                            </div>
                        </div>

                        <div>
                            <div style="font-weight: 500; font-size: 14px; margin-bottom: 8px;">✅ 审核标准</div>
                            <ul style="font-size: 13px; color: var(--gray-600); padding-left: 16px; line-height: 1.8;">
                                <li>字数需与原词大体相近。</li>
                                <li>词意需符合指定风格（年轻下沉）。</li>
                                <li>如存在严重的不通顺或脱离原意，请打回并说明具体原因。</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `,
    },
    'manual-composition-page': {
        title: '工作台 (跑曲)',
        content: `
            <div class="content-wrapper" style="display: flex; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
              <div class="col-left" style="flex: 1; display: flex; flex-direction: column; gap: 24px;">

                <div style="display: none; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; background: #fff; border: 1px solid var(--gray-200); border-radius: 8px; box-shadow: var(--shadow-sm);">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-size: 13px; color: var(--gray-500);">当前任务</span>
                    <span style="font-size: 15px; font-weight: 600; color: var(--gray-900);">跑曲任务 - 思念的风景</span>
                  </div>
                  <div style="display: flex; gap: 8px; flex-shrink: 0;">
                    <button class="btn-primary" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-700);" onclick="switchWorkbenchTask('跑曲', '上一任务')"><i class="fas fa-chevron-left"></i> 上一任务</button>
                    <button class="btn-primary" onclick="switchWorkbenchTask('跑曲', '下一任务')">下一任务 <i class="fas fa-chevron-right"></i></button>
                  </div>
                </div>

                <!-- 步骤导航条 -->
                <div style="display: flex; gap: 32px; border-bottom: 1px solid var(--gray-200); padding-bottom: 12px;">
                  <div id="compTab1" onclick="switchCompositionStep(1)"
                    style="font-size: 15px; font-weight: 600; color: var(--primary); cursor: pointer; border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: -13px;">
                    1. 任务要求与参考素材</div>
                  <div id="compTab2" onclick="switchCompositionStep(2)"
                    style="font-size: 15px; font-weight: 500; color: var(--gray-600); cursor: pointer; padding-bottom: 10px; margin-bottom: -13px;">
                    2. 成品上传与提交</div>
                </div>

                <!-- ================= 页面一：任务要求与参考 ================= -->
                <div id="compStep1Content" style="display: flex; flex-direction: column; gap: 24px; flex: 1;">

                  <!-- 作词信息区 -->
                  <div class="info-card" style="margin-bottom: 0;">
                    <h4>📝 作词信息</h4>
                    <div style="background: var(--gray-50); padding: 16px; border-radius: 8px; border: 1px solid var(--gray-200);">
                        <div class="form-group" style="position: relative;">
                          <label>歌名 (title)</label>
                          <input type="text" value="思念的风景" readonly style="background: var(--gray-100);">
                        </div>
                        <div class="form-group" style="margin-bottom: 0; position: relative;">
                          <label>歌词 (lyrics)</label>
                          <textarea readonly style="min-height: 120px; background: var(--gray-100); resize: none;">[Verse]
窗外的风轻轻吹过
带走了你的消息
那些年说过的话
都变成了风景</textarea>
                        </div>
                    </div>
                  </div>

                  <!-- AI 生成参数配置 -->
                  <div class="info-card" style="margin-bottom: 0;">
                    <h4>🤖 跑曲生成参数配置</h4>

                    <div class="form-group" style="margin-bottom: 0;">
                      <label style="font-weight: 600; color: var(--primary); font-size: 13px;">🌟 跑曲提示词选择 (Prompt)</label>
                      <select id="compPromptSelect" style="font-size: 14px; padding: 10px; height: auto;"
                        onchange="handleCompositionPromptChange(this.value)">
                        <option value="">-- 请选择跑曲提示词 --</option>
                      </select>
                    </div>

                    <div id="compBusinessInfoCard" style="display: none; margin-top: 12px; padding: 12px 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: #fff; box-shadow: var(--shadow-sm);">
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 18px; font-weight: 700; color: var(--gray-900);">
                        <i class="fas fa-sliders-h" style="color: var(--primary);"></i>
                        <span>配置信息</span>
                      </div>
                      <div id="compBusinessInfoList" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(260px, 1.25fr); grid-auto-rows: minmax(56px, auto); gap: 10px 16px; align-items: stretch; font-size: 13px;"></div>
                    </div>

                    <!-- 参数与素材区 (选中提示词后展开) -->
                    <div id="compAiConfigArea" style="display: none; flex-direction: column; margin-top: 24px;">

                      <div id="compReferenceArea"
                        style="background: #fff; padding: 24px 20px 20px; border-radius: 8px; border: 1px solid var(--gray-200); margin-bottom: 24px; box-shadow: var(--shadow-sm);">
                        <!-- 灵感参考池 -->
                        <div id="compInspoAudioCard" style="display: none; flex-direction: column;">
                          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px;">
                            <div style="display: flex; align-items: center; gap: 10px; font-size: 18px; color: var(--gray-900); font-weight: 700;">
                              <i class="fas fa-music" style="font-size: 22px;"></i>
                              <span>灵感参考音频</span>
                            </div>
                            <div style="position: relative;">
                              <button class="btn-primary" onclick="openCompositionAudioFileModal('inspo')" style="height: 38px; padding: 0 18px; box-shadow: var(--shadow-sm);">
                                添加音频文件
                              </button>
                            </div>
                          </div>
                          <div id="compInspoAudioResourceList" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 14px; min-height: 220px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: #fff;">
                              <div style="display: flex; align-items: center; gap: 18px;">
                                <span class="badge" style="background: #EFF6FF; color: var(--primary); border: 1px solid #BFDBFE; font-size: 14px; padding: 6px 12px;">文件</span>
                                <strong style="font-size: 15px; color: var(--gray-900);">若云汀 测试 (1).wav</strong>
                              </div>
                              <audio controls style="width: 100%; margin-top: auto;">
                                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                              </audio>
                              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;">重新上传</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--danger); color: var(--danger); height: 38px;">删除</button>
                              </div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 14px; min-height: 180px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: #fff;">
                              <div style="display: flex; align-items: center; gap: 18px;">
                                <span class="badge" style="background: #EFF6FF; color: var(--primary); border: 1px solid #BFDBFE; font-size: 14px; padding: 6px 12px;">文件</span>
                                <strong style="font-size: 15px; color: var(--gray-900);">demo.mp3</strong>
                              </div>
                              <audio controls style="width: 100%; margin-top: auto;">
                                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                              </audio>
                              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: auto;">
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;">重新上传</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--danger); color: var(--danger); height: 38px;">删除</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Cover 参考原曲 -->
                        <div id="compCoverAudioCard" style="display: none; flex-direction: column;">
                          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px;">
                            <div style="display: flex; align-items: center; gap: 10px; font-size: 18px; color: var(--gray-900); font-weight: 700;">
                              <i class="fas fa-music" style="font-size: 22px;"></i>
                              <span>Cover 参考原曲</span>
                              <span style="font-size: 15px; color: var(--gray-500); font-weight: 600;">(cover_audio)</span>
                            </div>
                            <div style="position: relative;">
                              <button class="btn-primary" onclick="openCompositionAudioFileModal('cover')" style="height: 38px; padding: 0 18px; box-shadow: var(--shadow-sm);">
                                添加音频文件
                              </button>
                            </div>
                          </div>
                          <div id="compCoverAudioResourceList" style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 14px; min-height: 220px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: #fff;">
                              <div style="display: flex; align-items: center; gap: 18px;">
                                <span class="badge" style="background: #EFF6FF; color: var(--primary); border: 1px solid #BFDBFE; font-size: 14px; padding: 6px 12px;">文件</span>
                                <strong style="font-size: 15px; color: var(--gray-900);">original_song_v1.mp3</strong>
                              </div>
                              <audio controls style="width: 100%; margin-top: auto;">
                                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                              </audio>
                              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;">重新上传</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--danger); color: var(--danger); height: 38px;">删除</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Sample 参考片段 -->
                        <div id="compSampleAudioCard" style="display: none; flex-direction: column;">
                          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px;">
                            <div style="display: flex; align-items: center; gap: 10px; font-size: 18px; color: var(--gray-900); font-weight: 700;">
                              <i class="fas fa-music" style="font-size: 22px;"></i>
                              <span>Sample 参考片段</span>
                              <span style="font-size: 15px; color: var(--gray-500); font-weight: 600;">(sample_audio)</span>
                            </div>
                            <div style="position: relative;">
                              <button class="btn-primary" onclick="openCompositionAudioFileModal('sample')" style="height: 38px; padding: 0 18px; box-shadow: var(--shadow-sm);">
                                添加音频文件
                              </button>
                            </div>
                          </div>
                          <div id="compSampleAudioResourceList" style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 14px; min-height: 220px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: #fff;">
                              <div style="display: flex; align-items: center; gap: 18px;">
                                <span class="badge" style="background: #EFF6FF; color: var(--primary); border: 1px solid #BFDBFE; font-size: 14px; padding: 6px 12px;">文件</span>
                                <strong style="font-size: 15px; color: var(--gray-900);">sample_source_v2.wav</strong>
                              </div>
                              <audio controls style="width: 100%; margin-top: auto;">
                                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                              </audio>
                              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;">重新上传</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--danger); color: var(--danger); height: 38px;">删除</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Prompt 模式空白占位 -->
                        <div id="compPromptEmptyCard"
                          style="display: none; align-items: center; justify-content: center; padding: 24px 0;">
                          <div style="color: var(--gray-400); font-size: 13px;">(当前模式无需参考音频)</div>
                        </div>
                      </div>

                      <!-- 第一页专属操作 -->
                      <button class="btn-primary" onclick="simulateCompositionGenerate()"
                        style="width: 100%; height: 44px; font-size: 15px;">🚀 请求 AI 跑曲生成</button>
                    </div>
                  </div>

                  <!-- 生成结果展示区 (默认隐藏) -->
                  <div class="info-card" id="compGeneratedResultCard"
                    style="display: none; border: 1px solid var(--primary); background: var(--primary-light);">
                    <div style="color: var(--primary); display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-weight: 600;">
                      <span>✨ AI 生成结果</span>
                      <span style="font-size: 12px; font-weight: normal; color: var(--gray-600);">💡 可试听生成音频，确认后进入下一步提交</span>
                    </div>

                    <div style="background: #fff; border: 1px solid var(--gray-200); border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
                      <div style="display: grid; grid-template-columns: 120px 1fr; border-bottom: 1px solid var(--gray-200);">
                        <div style="padding: 14px 16px; background: var(--gray-50); color: var(--gray-600); font-size: 13px; font-weight: 600;">生成状态</div>
                        <div style="padding: 14px 16px;">
                          <span id="compGenerateStatusBadge" class="badge badge-orange">生成中</span>
                        </div>
                      </div>
                      <div style="display: grid; grid-template-columns: 120px 1fr;">
                        <div style="padding: 14px 16px; background: var(--gray-50); color: var(--gray-600); font-size: 13px; font-weight: 600;">失败原因</div>
                        <div id="compGenerateFailReason" style="padding: 14px 16px; color: var(--gray-500); font-size: 13px;">-</div>
                      </div>
                    </div>

                    <div style="display: flex; gap: 16px;" id="compGeneratedColumnsContainer">
                      <div id="compResult1Block" style="flex: 1; background: #fff; border: 1px solid transparent; border-radius: 8px; overflow: hidden; transition: all 0.3s;">
                         <div style="display: flex; align-items: center; justify-content: space-between;  margin-bottom: 22px; padding: 12px 16px;">
                            <div style="display: flex; align-items: center; color: var(--gray-900); font-weight: 700;">
                              <span>候选音频 1：思念的风景_v1.mp3</span>
                            </div>
                            <div style="position: relative;">
                            <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                            </div>
                            </div>
                        <div style="display: grid; grid-template-columns: 96px 1fr; border-bottom: 1px solid var(--gray-200);">
                          <div style="padding: 14px 16px; background: var(--gray-50); color: var(--gray-600); font-size: 13px; font-weight: 600;">生成音频</div>
                          <div style="padding: 12px 16px;">
                            <div class="composition-file-row">
                              <audio controls style="width: 100%; margin-top: auto;">
                                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                              </audio>
                            </div>
                          </div>
                        </div>
                        <div  style="padding: 12px 16px;">
                        
                          <button class="btn-primary" id="compSelectBtn1" style="width: 100%; background: #fff; border: 1px solid var(--primary); color: var(--primary);" onclick="selectCompositionResult(1)">选取此版本</button>
                        </div>
                      </div>

                      <div id="compResult2Block" style="flex: 1; background: #fff; border: 1px solid transparent; border-radius: 8px; overflow: hidden; transition: all 0.3s;">
                         <div style="display: flex; align-items: center; justify-content: space-between;  margin-bottom: 22px; padding: 12px 16px;">
                            <div style="display: flex; align-items: center; color: var(--gray-900); font-weight: 700;">
                              <span>候选音频 2：思念的风景_v2.mp3</span>
                            </div>
                            <div style="position: relative;">
                            <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                            </div>
                            </div>
                        <div style="display: grid; grid-template-columns: 96px 1fr; border-bottom: 1px solid var(--gray-200);">
                          <div style="padding: 14px 16px; background: var(--gray-50); color: var(--gray-600); font-size: 13px; font-weight: 600;">生成音频</div>
                          <div style="padding: 12px 16px;">
                            <div class="composition-file-row">
                               <audio controls style="width: 100%; margin-top: auto;">
                                <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                              </audio>
                            </div>
                          </div>
                        </div>
                        <div style="padding: 12px 16px;">
                          <button class="btn-primary" id="compSelectBtn2" style="width: 100%; background: #fff; border: 1px solid var(--primary); color: var(--primary);" onclick="selectCompositionResult(2)">选取此版本</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 底部操作栏 -->
                  <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                    <button class="btn-primary" style="background: var(--danger); border-color: var(--danger); color: #fff;" onclick="showCompositionAbortModal()">终止任务</button>
                    <button class="btn-primary" onclick="switchCompositionStep(2)">下一步：成品获取与提交 ➡️</button>
                  </div>

                </div>

                <!-- ================= 页面二：成品上传与提交 ================= -->
                <div id="compStep2Content" style="display: none; flex-direction: column; gap: 24px; flex: 1;">

                  <div id="compStep2RejectReasonBlock" class="info-card"
                    style="display: none; margin-bottom: 0; border: 1px solid #ff7875; background: #fff1f0; box-shadow: 0 8px 20px rgba(255,77,79,0.12);">
                    <div style="display: flex; align-items: flex-start; gap: 14px;">
                      <div style="width: 36px; height: 36px; border-radius: 50%; background: #ff4d4f; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">!</div>
                      <div style="flex: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px;">
                          <h4 style="margin: 0; color: #cf1322; font-size: 16px;">任务打回原因</h4>
                          <span style="padding: 3px 10px; border-radius: 999px; background: #ffccc7; color: #a8071a; font-size: 12px; font-weight: 600; white-space: nowrap;">需重新处理</span>
                        </div>
                        <div style="background: #fff; border: 1px solid #ffa39e; border-radius: 8px; padding: 14px 16px; color: #820014; font-size: 14px; line-height: 1.7; font-weight: 500;">
                          跑出来的音频人声部分有明显的杂音，而且在高音部分出现了破音，请重新调整提示词或者多抽几遍更换更好的结果。
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="info-card" style="flex: 1; display: flex; flex-direction: column; margin-bottom: 0;">
                    <h4>💿 成品音频 (必填)</h4>

                    <div id="compUploadArea" onclick="simulateRealCompositionUpload()"
                      style="flex: 1; min-height: 200px; border: 1px dashed var(--gray-300); border-radius: var(--radius); padding: 40px 20px; text-align: center; background-color: var(--gray-50); cursor: pointer; transition: border-color 0.3s; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px;">
                      <div style="font-size: 36px; color: var(--primary);">☁️</div>
                      <div style="font-size: 15px; font-weight: 600; color: var(--gray-800);">等待 API 传回或点击手动上传成品音频</div>
                      <div style="font-size: 12px; color: var(--gray-500);">支持 .mp3, .wav 等格式。</div>
                    </div>

                    <!-- 上传进度演示 -->
                    <div id="compUploadProgress" style="display: none; margin-top: 24px;">
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
                        <span>获取中... <span style="color:var(--gray-500);">generated_audio_v1.mp3</span></span>
                        <span style="color: var(--primary); font-weight: 600;">68%</span>
                      </div>
                      <div style="height: 6px; background: var(--gray-200); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; background: var(--primary); width: 68%;"></div>
                      </div>
                    </div>

                    <!-- 上传后的展示区 -->
                    <div class="uploaded-card" id="compUploadedCard"
                      style="display: none; flex-direction: column; gap: 16px; margin-top: 24px; border: 1px solid var(--gray-300); border-radius: 6px; padding: 16px; background: #fff;">
                      <div style="font-size: 14px; font-weight: 500; color: var(--success);">✅ 已获取成品</div>
                      <!-- 唯一成品 -->
                      <div id="compTrackItem1"
                        style="border: 1px solid var(--gray-200); border-radius: 8px; padding: 12px; background: var(--gray-50);">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 14px; line-height: 1.5;">
                          <span style="color: var(--gray-600); font-weight: 500;">名称：</span>
                          <span id="compFinalTrackName" style="color: var(--gray-800); font-weight: 600;">思念的风景_v1.mp3</span>
                        </div>
                        <audio controls style="width: 100%;">
                          <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                        </audio>
                      </div>

                      <div style="display: flex; justify-content: flex-end; gap: 10px; width: 100%; margin-top: 8px;">
                        <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary);">
                          <i class="fas fa-download"></i> 下载</button>
                        <button class="btn-primary" style="background: #fff; border: 1px solid var(--danger); color: var(--danger);"
                          onclick="resetCompositionUpload()"><i class="fas fa-trash-alt"></i> 删除</button>
                      </div>
                    </div>

                  </div>

                  <!-- 底部操作栏 -->
                  <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                    <button class="btn-primary" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-700);"
                      onclick="switchCompositionStep(1)">⬅️ 返回前一步</button>
                    <button class="btn-primary" style="background: var(--danger); border-color: var(--danger); color: #fff;" onclick="showCompositionAbortModal()">终止任务</button>
                    <button class="btn-primary" id="compSubmitBtn" disabled onclick="showCompositionSubmitModal()">确认提交结果</button>
                  </div>
                </div>

              </div>

              <div class="col-right" style="width: 340px; display: flex; flex-direction: column; gap: 24px; flex-shrink: 0;">
                <div class="info-card" style="margin-bottom: 0;">
                  <h4>上下文信息</h4>

                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 500; font-size: 13px; margin-bottom: 8px; color: var(--gray-800);">📌 任务说明</div>
                    <div style="font-size: 12px; color: var(--gray-600); line-height: 1.6;">
                      当前任务为跑曲环节。请核实左侧传递来的文本参考以及参考音频，点击生成或在外部平台完成对应的生成并进行试听筛选，取得满意的成品录音后返回此页上传并提交。
                    </div>
                  </div>

                  <div>
                    <div style="font-weight: 500; font-size: 13px; margin-bottom: 8px; color: var(--gray-800);">✅ 制作标准</div>
                    <ul style="font-size: 12px; color: var(--gray-600); padding-left: 16px; line-height: 1.8;">
                      <li>上传的必须是包含伴奏 and 人声的完整成品</li>
                      <li>注意核对歌词有无漏词、错词现象</li>
                      <li>音频不能存在中间卡顿、爆音等硬伤</li>
                    </ul>
                  </div>
                </div>

                <!-- 演示辅助控制器 -->
                <div class="info-card" style="margin-bottom: 0; background: var(--gray-50); border: 1px dashed var(--gray-300);">
                  <h4>⚙️ 演示控制面板</h4>
                  <button class="btn-primary" onclick="simulateCompositionRejected()" style="width: 100%; background: var(--danger); border-color: var(--danger); font-size: 13px;">触发“打回重做”状态</button>
                </div>
              </div>
            </div>
        `
    },
    'song-review-page': {
        title: '工作台 (曲审核)',
        content: `
            <div class="content-wrapper" style="display: flex; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
              <div class="col-left" style="flex: 1; display: flex; flex-direction: column; gap: 24px;">

                <div style="display: none; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; background: #fff; border: 1px solid var(--gray-200); border-radius: 8px; box-shadow: var(--shadow-sm);">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-size: 13px; color: var(--gray-500);">当前任务</span>
                    <span style="font-size: 15px; font-weight: 600; color: var(--gray-900);">曲审核任务 - 星河旅人</span>
                  </div>
                  <div style="display: flex; gap: 8px; flex-shrink: 0;">
                    <button class="btn-primary" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-700);" onclick="switchWorkbenchTask('曲审核', '上一任务')"><i class="fas fa-chevron-left"></i> 上一任务</button>
                    <button class="btn-primary" onclick="switchWorkbenchTask('曲审核', '下一任务')">下一任务 <i class="fas fa-chevron-right"></i></button>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: minmax(0, 1.136fr) minmax(432px, 0.864fr); gap: 20px; align-items: stretch;">
                  <div class="info-card" style="margin-bottom: 0; padding: 24px 28px; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 18px; border-bottom: 1px solid var(--gray-200); margin-bottom: 20px;">
                      <h3 style="font-size: 15px; font-weight: 600; color: var(--gray-900); margin: 0;">歌曲内容</h3>
                    </div>
                    <div style="color: #5b6b8a; font-size: 14px; font-weight: 700; margin-bottom: 10px;">歌名</div>
                    <div style="font-size: 16px; line-height: 1.5; color: var(--gray-900); font-weight: 600; margin-bottom: 22px;">星河旅人</div>
                    <span id="srWorkflowMode" style="display: none;">inspo</span>

                    <div style="color: var(--primary); font-size: 15px; font-weight: 700; margin-bottom: 8px;">音频</div>
                    <div style="padding: 18px 20px; border: 1px solid var(--gray-200); border-radius: 14px; background: #fff; margin-bottom: 18px;">
                      <audio controls style="width: 100%; outline: none;">
                        <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                        您的浏览器不支持 audio 元素。
                      </audio>
                    </div>

                    <div style="color: #5b6b8a; font-size: 15px; font-weight: 700; margin-bottom: 8px;">歌词</div>
                    <div style="min-height: 270px; padding: 22px 24px; border: 1px solid var(--gray-200); border-radius: 12px; background: #fff; color: var(--gray-800); font-size: 16px; line-height: 2;">
                      <strong>[Verse]</strong><br>
                      穿越无边的星海，追寻遥远的光<br>
                      每一颗星都是一个未完的故事<br><br>
                      <strong>[Chorus]</strong><br>
                      我是星河旅人，在宇宙间漫游<br>
                      寻找属于我的归宿
                    </div>

                    <div style="color: var(--primary); font-size: 15px; font-weight: 700; margin: 18px 0 8px;">任务备注</div>
                    <div style="display: flex; gap: 16px; align-items: flex-start; padding: 16px 18px; border: 1px solid var(--gray-200); border-radius: 12px; background: #fff;">
                      <div style="width: 34px; height: 34px; border: 1px solid #91caff; color: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="far fa-comment"></i>
                      </div>
                      <div style="font-size: 15px; color: var(--gray-700); line-height: 1.8;">
                        为了解决高音破音问题，我重新调整了 prompt 的配器，削弱了电吉他的高频，并在第三次生成中得到了这个满意的版本。
                      </div>
                    </div>

                    <div style="color: #5b6b8a; font-size: 15px; font-weight: 700; margin: 18px 0 8px;">生成配置</div>
                    <div style="padding: 16px 18px; border: 1px solid var(--gray-200); border-radius: 12px; background: #fff;">
                      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; font-size: 13px;">
                          <div data-tooltip="提示词获取" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()" style="min-width: 0; padding: 8px 10px; border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-50);">
                            <div style="color: var(--gray-500); margin-bottom: 4px;">配置名称</div>
                            <div style="max-width: 100%; color: var(--gray-900); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">提示词获取</div>
                          </div>
                          <div data-tooltip="年轻ins1" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()" style="min-width: 0; padding: 8px 10px; border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-50);">
                            <div style="color: var(--gray-500); margin-bottom: 4px;">风格</div>
                            <div style="max-width: 100%; color: var(--gray-900); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">年轻ins1</div>
                          </div>
                          <div data-tooltip="欣瑶-女，赵磊-男" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()" style="min-width: 0; padding: 8px 10px; border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-50);">
                            <div style="color: var(--gray-500); margin-bottom: 4px;">歌手</div>
                            <div style="max-width: 100%; color: var(--gray-900); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">欣瑶-女，赵磊-男</div>
                          </div>
                          <div data-tooltip="inspo" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()" style="min-width: 0; padding: 8px 10px; border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-50);">
                            <div style="color: var(--gray-500); margin-bottom: 4px;">生成方式</div>
                            <div style="max-width: 100%; color: var(--primary); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">inspo</div>
                          </div>
                      </div>
                    </div>
                  </div>

                <!-- 审核打分 -->
                <div class="info-card" style="margin-bottom: 0;">
                  <h4>审核意见与评分</h4>
                  
                  <!-- 快捷评分区 -->
                  <div style="background: var(--gray-50); padding: 16px; border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 24px;">
                    <span style="font-weight: 600; font-size: 13px; display: block; margin-bottom: 12px; color: var(--gray-800);">快捷评分</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('风格不对', this)">风格不对</button>
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('同质化', this)">同质化</button>
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('读音问题', this)">读音问题</button>
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('音质低质', this)">音质低质</button>
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('结构问题', this)">结构问题</button>
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('音频中断', this)">音频中断</button>
                      <button class="btn-primary sr-quick-reject-btn" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-600); padding: 6px 14px; border-radius: 20px; font-size: 12px; height: auto;" onclick="quickRejectSongReview('音频超时', this)">音频超时</button>
                    </div>
                  </div>

                  <!-- 星级打分 -->
                  <div style="margin-bottom: 24px;">
                    <p style="font-size: 13px; color: var(--gray-500); margin-bottom: 16px;">请仔细聆听生成的音频，并就以下维度分别给出 0-3 星评分。</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                      <!-- Melody -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">旋律表现</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <input type="radio" name="sr_melody" id="sr_m0" value="0" class="sr-zero-input" onchange="calculateSongRating()">
                          <button type="button" class="sr-zero-btn" data-zero-input="sr_m0" onclick="toggleZeroStarRating('sr_m0')">0星</button>
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_melody" id="sr_m3" value="3" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_m3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_melody" id="sr_m2" value="2" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_m2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_melody" id="sr_m1" value="1" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_m1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Lyrics -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">歌词贴合度</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <input type="radio" name="sr_lyrics" id="sr_l0" value="0" class="sr-zero-input" onchange="calculateSongRating()">
                          <button type="button" class="sr-zero-btn" data-zero-input="sr_l0" onclick="toggleZeroStarRating('sr_l0')">0星</button>
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_lyrics" id="sr_l3" value="3" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_l3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_lyrics" id="sr_l2" value="2" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_l2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_lyrics" id="sr_l1" value="1" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_l1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Vocal -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">人声质感</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <input type="radio" name="sr_vocal" id="sr_v0" value="0" class="sr-zero-input" onchange="calculateSongRating()">
                          <button type="button" class="sr-zero-btn" data-zero-input="sr_v0" onclick="toggleZeroStarRating('sr_v0')">0星</button>
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_vocal" id="sr_v3" value="3" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_v3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_vocal" id="sr_v2" value="2" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_v2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_vocal" id="sr_v1" value="1" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_v1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                        </div>
                      </div>

                      <!-- Audio Quality -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">音频质量</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <input type="radio" name="sr_audio_quality" id="sr_a0" value="0" class="sr-zero-input" onchange="calculateSongRating()">
                          <button type="button" class="sr-zero-btn" data-zero-input="sr_a0" onclick="toggleZeroStarRating('sr_a0')">0星</button>
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_audio_quality" id="sr_a3" value="3" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_a3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_audio_quality" id="sr_a2" value="2" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_a2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_audio_quality" id="sr_a1" value="1" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_a1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                        </div>
                      </div>

                      <!-- Arrangement -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">编曲层次</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <input type="radio" name="sr_arrangement" id="sr_ar0" value="0" class="sr-zero-input" onchange="calculateSongRating()">
                          <button type="button" class="sr-zero-btn" data-zero-input="sr_ar0" onclick="toggleZeroStarRating('sr_ar0')">0星</button>
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_arrangement" id="sr_ar3" value="3" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_ar3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_arrangement" id="sr_ar2" value="2" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_ar2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_arrangement" id="sr_ar1" value="1" style="display:none;" onchange="handleStarRatingChange(this)"><label for="sr_ar1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- CSS for stars rating hover and checked state -->
                  <style>
                    .sr-zero-input {
                      display: none;
                    }
                    .sr-zero-btn {
                      height: 24px;
                      padding: 0 8px;
                      border: 1px solid var(--gray-300);
                      border-radius: 12px;
                      background: #fff;
                      color: var(--gray-300);
                      cursor: pointer;
                      font-size: 12px;
                      line-height: 22px;
                    }
                    .sr-zero-btn.active {
                      border-color: var(--danger);
                      color: var(--danger);
                    }
                    .stars-rating label:hover,
                    .stars-rating label:hover ~ label,
                    .stars-rating input:checked ~ label {
                      color: #faad14 !important;
                    }
                  </style>

                  <!-- 评级结果展示与备注 -->
                  <div id="srFinalSection" style="display: none;">
                    <div style="background: var(--gray-50); padding: 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--gray-200);">
                      <span style="font-weight: 500; font-size: 13px; color: var(--gray-800);">系统判定评级：</span>
                      <span id="srFinalRatingBadge" style="padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 15px;">-</span>
                    </div>

                    <div class="form-group" id="srRemarkContainer">
                      <label id="srRemarkLabel" style="font-weight: 500; font-size: 13px; color: var(--gray-800);">综合评语</label>
                      <textarea class="input" id="srRemarkInput" placeholder="请输入您的意见..." style="min-height: 80px; resize: none;"></textarea>
                    </div>

                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 12px;">
                      <button class="btn-primary" style="background: #fff; border: 1px solid var(--gray-300); color: var(--gray-700);" onclick="resetSongReview()">重置</button>
                      <button class="btn-primary" id="srRejectBtn" style="display: none; background: #fff; border: 1px solid var(--danger); color: var(--danger);" onclick="rejectSongReview()">打回</button>
                      <button class="btn-primary" id="srSubmitBtn" onclick="submitSongReview()">提交审核结果</button>
                    </div>
                  </div>

                  <div class="modal-overlay" id="srAbortModalOverlay" style="display:none;">
                    <div class="modal modal-sm" style="width: 480px;">
                      <div class="modal-header">
                        <h3>终止任务</h3>
                        <button class="modal-close" onclick="closeSongReviewAbortModal()">&times;</button>
                      </div>
                      <div class="modal-body">
                        <p style="line-height: 1.6; color: var(--gray-800); font-size: 14px; margin: 0;">是否确认终止当前任务？终止后当前任务将停止继续流转。</p>
                      </div>
                      <div class="modal-footer">
                        <button class="btn-default" onclick="closeSongReviewAbortModal()">取消</button>
                        <button class="btn-primary" style="background: var(--danger); border-color: var(--danger);" onclick="confirmSongReviewAbort()">确认终止</button>
                      </div>
                    </div>
                  </div>

                </div>

	                </div>

                <!-- Cover 参考原曲（仅 cover / prompt 模式展示） -->
                <div class="info-card" id="srCoverAudioCard" style="display: none; margin-bottom: 0;">
                  <h4>🎵 Cover 参考原曲 (cover_audio)</h4>
                  <div style="display: flex; align-items: center; justify-content: space-between; background: var(--gray-50); padding: 12px 16px; border-radius: 6px; border: 1px solid var(--gray-200); margin-bottom: 16px;">
                    <span style="font-size: 13px; color: var(--gray-800); font-weight: 500;">🎵 original_song_v1.mp3</span>
                    <span style="font-size: 12px; color: var(--gray-500);">03:12</span>
                  </div>
                  <audio controls style="width: 100%;">
                    <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                    您的浏览器不支持 audio 元素。
                  </audio>
                </div>

              </div>

              <div class="col-right" style="width: 340px; display: flex; flex-direction: column; gap: 24px; flex-shrink: 0;">
                <div class="info-card" style="margin-bottom: 0;">
                  <h4>上下文信息</h4>
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 500; font-size: 13px; margin-bottom: 8px; color: var(--gray-800);">📋 任务说明</div>
                    <div style="padding: 10px 14px; background: var(--primary-light); border-radius: 6px; border: 1px solid var(--primary); font-size: 12px; color: var(--gray-700); line-height: 1.6;">
                      当前任务为<strong>人工审核评估</strong>环节。请仔细聆听左侧试听区的最终生成的混音音频，核查其表现是否符合预期，以及与歌词和设定提示词是否有明显割裂。不符合要求点击打回，符合要求则进行多维度打分放行。
                    </div>
                  </div>

                  <div>
                    <div style="font-weight: 500; font-size: 13px; margin-bottom: 8px; color: var(--gray-800);">✅ 审核标准</div>
                    <ul style="font-size: 12px; color: var(--gray-600); padding-left: 16px; line-height: 1.8;">
                      <li><strong>旋律表现</strong>：旋律线条是否顺畅，起承转合是否自然。</li>
                      <li><strong>歌词贴合度</strong>：断句与副歌的高潮感是否被精准咬字展现。</li>
                      <li><strong>人声质感</strong>：是否出现了无法消除的机器嘶哑感音质破坏。</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
        `
    },
    'reference-library-page': {
        title: '对标曲库',
        content: `
            <div class="content-wrapper" style="display: flex; flex-direction: column; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
                
                <!-- 搜索过滤区 -->
                <div class="filter-bar">
                    <div class="filter-row">
                        <div class="filter-item" style="max-width: 220px; flex: 1;">
                            <label>歌名</label>
                            <input type="text" id="refLibSearchName" placeholder="搜索歌名...">
                        </div>
                        <div class="filter-item" style="max-width: 220px; flex: 1;">
                            <label>歌手</label>
                            <input type="text" id="refLibSearchSinger" placeholder="搜索歌手...">
                        </div>
                        <div class="filter-item" style="max-width: 200px; flex: 1;">
                            <label>风格标签</label>
                            <select class="input" id="refLibSearchStyle">
                                <option value="">全部</option>
                            </select>
                        </div>
                        <div class="filter-item" style="max-width: 180px; flex: 1;">
                            <label>状态</label>
                            <select class="input" id="refLibSearchStatus">
                                <option value="">全部</option>
                                <option value="已入库">已入库</option>
                                <option value="已使用">已使用</option>
                                <option value="已禁用">已禁用</option>
                            </select>
                        </div>
                        <div class="filter-item" style="flex: none; display: flex; gap: 10px; flex-direction: row; align-items: flex-end; height: 38px;">
                            <button class="btn-primary" onclick="doRefLibSearch()"><i class="fas fa-search"></i> 查询</button>
                            <button class="btn-default" onclick="resetRefLibSearch()">重置</button>
                        </div>
                    </div>
                </div>

                <!-- 数据表格区域 -->
                <div class="info-card" style="padding: 0; position: relative; min-height: 300px; margin-bottom: 0;">
                    <!-- Loading Overlay -->
                    <div id="refLibTableLoading" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); justify-content: center; align-items: center; z-index: 20; flex-direction: column; gap: 12px; border-radius: var(--radius);">
                        <div class="spinner-loader" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite;"></div>
                        <div style="color: var(--primary); font-size: 14px; font-weight: 500;">正在查询数据...</div>
                    </div>

                    <!-- Toolbar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--gray-200);">
                        <div style="font-weight: 600; font-size: 14px; color: var(--gray-800);">参考歌曲列表</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="btn-default" onclick="openModal('batchPlaylistImportModal')"><i class="fas fa-layer-group"></i> 批量导入歌单</button>
                            <button class="btn-primary" onclick="openModal('importModal')"><i class="fas fa-plus"></i> 歌单导入</button>
                        </div>
                    </div>

                    <!-- Table Container -->
                    <div class="table-container">
                        <table class="data-table" id="refLibTable">
                            <thead>
                                <tr>
                                    <th style="width: 160px;">歌单 ID</th>
                                    <th style="width: 90px;">对标ID</th>
                                    <th style="width: 180px;">歌名</th>
                                    <th style="width: 140px;">歌手</th>
                                    <th>歌词</th>
                                    <th style="width: 180px;">风格</th>
                                    <th style="width: 100px;">状态</th>
                                    <th style="width: 140px;">操作</th>
                                </tr>
                            </thead>
                            <tbody id="refLibTableBody">
                                <!-- Rendered dynamically -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination" style="display: flex; justify-content: center; align-items: center; padding: 16px 24px; border-top: 1px solid var(--gray-200); gap: 12px;">
                        <button class="btn-default" style="padding: 5px 12px;" disabled>上一页</button>
                        <span style="font-size: 13px; color: var(--gray-600);">1 / 1</span>
                        <button class="btn-default" style="padding: 5px 12px;" disabled>下一页</button>
                    </div>
                </div>
            </div>
        `
    },
    'node-types-page': {
        title: '节点管理',
        content: `
            <div class="content-wrapper" style="display: flex; flex-direction: column; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
                
                <!-- 搜索过滤区 -->
                <div class="filter-bar">
                    <div class="filter-row">
                        <div class="filter-item" style="max-width: 240px; flex: 1;">
                            <label>节点名称</label>
                            <input type="text" id="nodeTypesSearchName" placeholder="搜索节点名称...">
                        </div>
                        <div class="filter-item" style="max-width: 200px; flex: 1;">
                            <label>节点属性</label>
                            <select class="input" id="nodeTypesSearchType">
                                <option value="">全部</option>
                                <option>人工节点</option>
                                <option>机器节点</option>
                            </select>
                        </div>
                        <div class="filter-item" style="max-width: 200px; flex: 1;">
                            <label>状态</label>
                            <select class="input" id="nodeTypesSearchStatus">
                                <option value="">全部</option>
                                <option>启用</option>
                                <option>已禁用</option>
                            </select>
                        </div>
                        <div class="filter-item" style="flex: none; display: flex; gap: 10px; flex-direction: row; align-items: flex-end; height: 38px;">
                            <button class="btn-primary" onclick="doNodeTypesSearch()"><i class="fas fa-search"></i> 查询</button>
                            <button class="btn-default" onclick="resetNodeTypesSearch()">重置</button>
                        </div>
                    </div>
                </div>

                <!-- 数据表格区域 -->
                <div class="info-card" style="padding: 0; position: relative; min-height: 300px; margin-bottom: 0;">
                    <!-- Loading Overlay -->
                    <div id="nodeTypesTableLoading" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); justify-content: center; align-items: center; z-index: 20; flex-direction: column; gap: 12px; border-radius: var(--radius);">
                        <div class="spinner-loader" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite;"></div>
                        <div style="color: var(--primary); font-size: 14px; font-weight: 500;">正在查询数据...</div>
                    </div>

                    <!-- Toolbar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--gray-200);">
                        <div style="font-weight: 600; font-size: 14px; color: var(--gray-800);">节点列表</div>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn-default" onclick="openNodeTypeExportModal()"><i class="fas fa-file-export"></i> 数据导出</button>
                        </div>
                    </div>

                    <!-- Table Container -->
                    <div class="table-container" style="overflow-x: auto;">
                        <table class="data-table" id="nodeTypesTable" style="min-width: 1400px;">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">ID</th>
                                    <th style="width: 140px;">节点名称</th>
                                    <th style="width: 90px;">生产环节</th>
                                    <th class="node-type-attr-col">节点属性</th>
                                    <th style="width: 90px;">是否配置</th>
                                    <th class="node-type-spec-col">输入字段规格</th>
                                    <th class="node-type-spec-col">配置字段规格</th>
                                    <th class="node-type-spec-col">输出字段规格</th>
                                    <th style="width: 80px;">版本</th>
                                    <th style="width: 150px;">变更日志</th>
                                    <th class="node-type-status-col">状态</th>
                                    <th style="width: 100px;">创建人</th>
                                    <th style="width: 120px;">创建时间</th>
                                    <th style="width: 100px;">重试次数</th>
                                    <th style="width: 120px;">重试逻辑</th>
                                    <th style="width: 120px;">重试间隔</th>
                                    <th style="width: 120px;">超时时间</th>
                                    <th style="width: 120px;">响应超时</th>
                                    <th style="width: 120px;">超时策略</th>
                                    <th class="sticky-right" style="width: 140px; text-align: center;">操作</th>
                                </tr>
                            </thead>
                            <tbody id="nodeTypesTableBody">
                                <!-- Rendered dynamically -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State -->
                    <div class="empty-state" id="nodeTypesEmptyState" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: var(--gray-400); gap: 16px;">
                        <div style="font-size: 48px;">📂</div>
                        <div style="font-size: 16px; font-weight: 500;">暂无数据</div>
                        <div style="font-size: 14px; color: var(--gray-500);">未查询到匹配的节点</div>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination" style="display: flex; justify-content: center; align-items: center; padding: 16px 24px; border-top: 1px solid var(--gray-200); gap: 12px;">
                        <button class="btn-default" style="padding: 5px 12px;" disabled>上一页</button>
                        <span style="font-size: 13px; color: var(--gray-600);">1 / 1</span>
                        <button class="btn-default" style="padding: 5px 12px;" disabled>下一页</button>
                    </div>
                </div>
            </div>
        `
    },
    'node-configs-page': {
        title: '节点配置库',
        content: `
            <div class="content-wrapper" style="display: flex; flex-direction: column; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
                
                <!-- Tabs Container -->
                <div style="background: var(--white); padding: 16px 24px 0; border-radius: var(--radius); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-200);">
                    <div class="tabs" id="nodeConfigTabs" style="display: flex; gap: 24px; border-bottom: 1px solid var(--gray-200); overflow-x: auto; white-space: nowrap;">
                        <!-- Rendered dynamically -->
                    </div>
                </div>

                <!-- 搜索过滤区 -->
                <div class="filter-bar">
                    <div class="filter-row">
                        <div class="filter-item" style="max-width: 200px; flex: 1;">
                            <label>风格</label>
                            <input type="text" id="nodeConfigSearchStyle" placeholder="搜索风格...">
                        </div>
                        <div class="filter-item" style="max-width: 160px; flex: 1;">
                            <label>状态</label>
                            <select class="input" id="nodeConfigSearchStatus">
                                <option value="">全部</option>
                                <option>启用</option>
                                <option>禁用</option>
                            </select>
                        </div>
                        <div class="filter-item" style="max-width: 200px; flex: 1;">
                            <label>创建人</label>
                            <input type="text" id="nodeConfigSearchCreator" placeholder="搜索创建人...">
                        </div>
                        <div class="filter-item" style="flex: none; display: flex; gap: 10px; flex-direction: row; align-items: flex-end; height: 38px;">
                            <button class="btn-primary" onclick="doNodeConfigSearch()"><i class="fas fa-search"></i> 查询</button>
                            <button class="btn-default" onclick="resetNodeConfigSearch()">重置</button>
                        </div>
                    </div>
                </div>

                <!-- 数据表格区域 -->
                <div class="info-card" style="padding: 0; position: relative; min-height: 300px; margin-bottom: 0;">
                    <!-- Loading Overlay -->
                    <div id="nodeConfigTableLoading" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); justify-content: center; align-items: center; z-index: 20; flex-direction: column; gap: 12px; border-radius: var(--radius);">
                        <div class="spinner-loader" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite;"></div>
                        <div style="color: var(--primary); font-size: 14px; font-weight: 500;">正在加载数据...</div>
                    </div>

                    <!-- Toolbar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--gray-200);">
                        <div style="font-weight: 600; font-size: 14px; color: var(--gray-800);" id="nodeConfigTableTitle">配置列表（歌词生成配置）</div>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn-primary" onclick="openNodeConfigDrawer('add')"><i class="fas fa-plus"></i> 新增配置</button>
                            <button class="btn-default" onclick="openNodeConfigExportModal()"><i class="fas fa-file-export"></i> 数据导出</button>
                        </div>
                    </div>

                    <!-- Table Container -->
                    <div class="table-container" style="overflow-x: auto;">
                        <table class="data-table" id="nodeConfigTable">
                            <thead id="nodeConfigTableHead">
                                <!-- Dynamic Headers -->
                            </thead>
                            <tbody id="nodeConfigTableBody">
                                <!-- Dynamic Rows -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State -->
                    <div class="empty-state" id="nodeConfigEmptyState" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: var(--gray-400); gap: 16px;">
                        <div style="font-size: 48px;">📂</div>
                        <div style="font-size: 16px; font-weight: 500;">暂无数据</div>
                        <div style="font-size: 14px; color: var(--gray-500);">未查询到匹配的配置实例</div>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination" style="display: flex; justify-content: center; align-items: center; padding: 16px 24px; border-top: 1px solid var(--gray-200); gap: 12px;">
                        <button class="btn-default" style="padding: 5px 12px;" disabled>上一页</button>
                        <span style="font-size: 13px; color: var(--gray-600);">1 / 1</span>
                        <button class="btn-default" style="padding: 5px 12px;" disabled>下一页</button>
                    </div>
                </div>
            </div>
        `
    },
    'workflow-page': {
        title: '工作流配置库',
        content: `
            <div class="content-wrapper" style="display: flex; flex-direction: column; gap: 0; padding: 0; min-height: calc(100vh - 100px);">

                <!-- Tabs -->
                <div id="wfTabsContainer" style="display: flex; border-bottom: 1px solid var(--gray-200); padding: 0 24px; background: #fff;">
                    <div class="tab-item active" onclick="switchWfTab('maintenance')" style="padding: 12px 24px; cursor: pointer; font-size: 14px; border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 600;">工作流维护</div>
                    <div class="tab-item" onclick="switchWfTab('template')" style="padding: 12px 24px; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent; color: var(--gray-600); font-weight: 500;">工作流模版</div>
                </div>

                <!-- === 工作流维护区域 === -->
                <div id="wfMaintenanceArea" style="display: flex; flex-direction: column; gap: 24px; padding: 24px; flex: 1;">
                    <div class="filter-bar">
                        <div class="filter-row">
                            <div class="filter-item" style="max-width: 240px; flex: 1;">
                                <label>模版名称</label>
                                <input type="text" id="wf_searchMainTemplate" placeholder="模糊搜索模版">
                            </div>
                            <div class="filter-item" style="max-width: 240px; flex: 1;">
                                <label>工作流名称</label>
                                <input type="text" id="wf_searchMainWorkflow" placeholder="模糊搜索工作流">
                            </div>
                            <div class="filter-item" style="max-width: 200px; flex: 1;">
                                <label>状态</label>
                                <select class="input" id="wf_searchMainStatus">
                                    <option value="">全部</option>
                                    <option>正常</option>
                                    <option>已禁用</option>
                                </select>
                            </div>
                            <div class="filter-item" style="flex: none; display: flex; gap: 10px; flex-direction: row; align-items: flex-end; height: 38px;">
                                <button class="btn-primary" onclick="doWfMainSearch()"><i class="fas fa-search"></i> 查询</button>
                                <button class="btn-default" onclick="resetWfMainSearch()">重置</button>
                            </div>
                        </div>
                    </div>
                    <div class="info-card" style="padding: 0; position: relative; min-height: 300px; margin-bottom: 0;">
                        <div id="wfMainTableLoading" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); justify-content: center; align-items: center; z-index: 20; flex-direction: column; gap: 12px; border-radius: var(--radius);">
                            <div style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite;"></div>
                            <div style="color: var(--primary); font-size: 14px; font-weight: 500;">正在查询数据...</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--gray-200);">
                            <div style="font-weight: 600; font-size: 14px; color: var(--gray-800);">工作流列表</div>
                            <div style="display: flex; gap: 12px;">
                                <button class="btn-primary" onclick="openWfWizard('add')"><i class="fas fa-plus"></i> 新增工作流</button>
                                <button class="btn-default" onclick="openWfExportModal()"><i class="fas fa-download"></i> 数据导出</button>
                            </div>
                        </div>
                        <div class="table-container" style="overflow-x: auto;">
                            <table class="data-table" id="wfMainTable">
                                <thead>
                                    <tr>
                                        <th style="width:60px">ID</th>
                                        <th>模版名称</th>
                                        <th>工作流名称</th>
                                        <th>节点</th>
                                        <th>版本</th>
                                        <th>变更日志</th>
                                        <th>状态</th>
                                        <th>创建人</th>
                                        <th>创建时间</th>
                                        <th class="sticky-right" style="width:130px; text-align:center;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="wfMainBody"></tbody>
                            </table>
                        </div>
                        <div id="wfMainEmpty" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: var(--gray-400); gap: 16px;">
                            <div style="font-size:48px">📂</div>
                            <div style="font-size:16px">暂无数据</div>
                            <div style="font-size:14px">请调整过滤条件或新增数据</div>
                        </div>
                    </div>
                </div>

                <!-- === 工作流模版区域 === -->
                <div id="wfTemplateArea" style="display: none; flex-direction: column; gap: 24px; padding: 24px; flex: 1;">
                    <div class="filter-bar">
                        <div class="filter-row">
                            <div class="filter-item" style="max-width: 240px; flex: 1;">
                                <label>模版名称</label>
                                <input type="text" id="wf_searchName" placeholder="模糊搜索名称">
                            </div>
                            <div class="filter-item" style="max-width: 200px; flex: 1;">
                                <label>版本</label>
                                <input type="text" id="wf_searchVersion" placeholder="如 V1.0.0">
                            </div>
                            <div class="filter-item" style="max-width: 200px; flex: 1;">
                                <label>状态</label>
                                <select class="input" id="wf_searchStatus">
                                    <option value="">全部</option>
                                    <option>正常</option>
                                    <option>已禁用</option>
                                </select>
                            </div>
                            <div class="filter-item" style="flex: none; display: flex; gap: 10px; flex-direction: row; align-items: flex-end; height: 38px;">
                                <button class="btn-primary" onclick="doWfTemplateSearch()"><i class="fas fa-search"></i> 查询</button>
                                <button class="btn-default" onclick="resetWfTemplateSearch()">重置</button>
                            </div>
                        </div>
                    </div>
                    <div class="info-card" style="padding: 0; position: relative; min-height: 300px; margin-bottom: 0;">
                        <div id="wfTplTableLoading" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); justify-content: center; align-items: center; z-index: 20; flex-direction: column; gap: 12px; border-radius: var(--radius);">
                            <div style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite;"></div>
                            <div style="color: var(--primary); font-size: 14px; font-weight: 500;">正在查询数据...</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--gray-200);">
                            <div style="font-weight: 600; font-size: 14px; color: var(--gray-800);">模版列表</div>
                            <div style="display: flex; gap: 12px;">
                                <button class="btn-primary" onclick="openWfTemplateDrawer('add')"><i class="fas fa-plus"></i> 新增模版</button>
                                <button class="btn-default" onclick="openWfExportModal()"><i class="fas fa-download"></i> 数据导出</button>
                            </div>
                        </div>
                        <div class="table-container" style="overflow-x: auto;">
                            <table class="data-table" id="wfTplTable">
                                <thead>
                                    <tr>
                                        <th style="width:60px">ID</th>
                                        <th>模版名称</th>
                                        <th>版本</th>
                                        <th>模版定义</th>
                                        <th>变更日志</th>
                                        <th>状态</th>
                                        <th>创建人</th>
                                        <th>创建时间</th>
                                        <th class="sticky-right" style="width:130px; text-align:center;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="wfTplBody"></tbody>
                            </table>
                        </div>
                        <div id="wfTplEmpty" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: var(--gray-400); gap: 16px;">
                            <div style="font-size:48px">📂</div>
                            <div style="font-size:16px">暂无数据</div>
                            <div style="font-size:14px">请调整过滤条件或新增数据</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    'singer-library-page': {
        title: '资产管理 (歌手名称表)',
        content: `
            <div class="content-wrapper" style="display: flex; flex-direction: column; gap: 24px; padding: 0; min-height: calc(100vh - 100px);">
                
                <!-- 搜索过滤区 -->
                <div class="filter-bar">
                    <div class="filter-row">
                        <div class="filter-item" style="max-width: 320px; flex: 1;">
                            <label>快速搜索</label>
                            <input type="text" id="singerSearchInput" placeholder="搜索歌手名称、内部名称或风格...">
                        </div>
                        <div class="filter-item" style="flex: none; display: flex; gap: 10px; flex-direction: row; align-items: flex-end; height: 38px;">
                            <button class="btn-primary" onclick="doSingerSearch()"><i class="fas fa-search"></i> 查询</button>
                            <button class="btn-default" onclick="resetSingerSearch()">重置</button>
                        </div>
                    </div>
                </div>

                <!-- 数据表格区域 -->
                <div class="info-card" style="padding: 0; position: relative; min-height: 300px; margin-bottom: 0;">
                    <!-- Loading Overlay -->
                    <div id="singerTableLoading" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.8); justify-content: center; align-items: center; z-index: 20; flex-direction: column; gap: 12px; border-radius: var(--radius);">
                        <div class="spinner-loader" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite;"></div>
                        <div style="color: var(--primary); font-size: 14px; font-weight: 500;">正在查询数据...</div>
                    </div>

                    <!-- Toolbar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--gray-200);">
                        <div style="font-weight: 600; font-size: 14px; color: var(--gray-800);">歌手列表</div>
                        <button class="btn-primary" onclick="openSingerDrawer('add')"><i class="fas fa-plus"></i> 新增歌手</button>
                    </div>

                    <!-- Table Container -->
                    <div class="table-container">
                        <table class="data-table" id="singerTable">
                            <thead>
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th style="width: 80px;">头像</th>
                                    <th>歌手名称</th>
                                    <th>内部名称</th>
                                    <th>性别</th>
                                    <th>风格</th>
                                    <th>状态</th>
                                    <th style="width: 140px;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr id="singer-row-1001">
                                    <td style="color: var(--gray-500);">1001</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=刘师砚&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">刘师砚</td>
                                    <td style="color: var(--gray-700);">石砚</td>
                                    <td>男</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">中年下沉</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1001">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1001')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1001" onclick="toggleDisableSinger('1001')">禁用</button>
                                    </td>
                                </tr>
                                <tr id="singer-row-1002">
                                    <td style="color: var(--gray-500);">1002</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=莫云&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">莫云</td>
                                    <td style="color: var(--gray-700);">云疏</td>
                                    <td>男</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">中年下沉</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1002">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1002')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1002" onclick="toggleDisableSinger('1002')">禁用</button>
                                    </td>
                                </tr>
                                <tr id="singer-row-1003">
                                    <td style="color: var(--gray-500);">1003</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=沈砚川&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">沈砚川</td>
                                    <td style="color: var(--gray-700);">康乐</td>
                                    <td>男</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">年轻下沉</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1003">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1003')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1003" onclick="toggleDisableSinger('1003')">禁用</button>
                                    </td>
                                </tr>
                                <tr id="singer-row-1004">
                                    <td style="color: var(--gray-500);">1004</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=云峥&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">云峥</td>
                                    <td style="color: var(--gray-700);">郑云</td>
                                    <td>男</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">80年代金曲</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1004">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1004')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1004" onclick="toggleDisableSinger('1004')">禁用</button>
                                    </td>
                                </tr>
                                <tr id="singer-row-1005">
                                    <td style="color: var(--gray-500);">1005</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=顾书萤&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">顾书萤</td>
                                    <td style="color: var(--gray-700);">书莹</td>
                                    <td>女</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">年轻下沉</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1005">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1005')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1005" onclick="toggleDisableSinger('1005')">禁用</button>
                                    </td>
                                </tr>
                                <tr id="singer-row-1006">
                                    <td style="color: var(--gray-500);">1006</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=沈韵娇&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">沈韵娇</td>
                                    <td style="color: var(--gray-700);">云娇</td>
                                    <td>女</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">年轻下沉</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1006">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1006')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1006" onclick="toggleDisableSinger('1006')">禁用</button>
                                    </td>
                                </tr>
                                <tr id="singer-row-1007">
                                    <td style="color: var(--gray-500);">1007</td>
                                    <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=苏星瑶&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
                                    <td style="font-weight: 600; color: var(--gray-900);">苏星瑶</td>
                                    <td style="color: var(--gray-700);">欣瑶</td>
                                    <td>女</td>
                                    <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">年轻下沉</span></td>
                                    <td><span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);" id="singer-status-1007">正常</span></td>
                                    <td>
                                        <button class="btn-text" onclick="openSingerDrawer('edit', '1007')">详情</button>
                                        <button class="btn-text danger" id="disable-btn-1007" onclick="toggleDisableSinger('1007')">禁用</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Empty State -->
                        <div id="singerEmptyState" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: var(--gray-400); gap: 16px;">
                            <div style="font-size: 48px;">📂</div>
                            <div style="font-size: 15px; font-weight: 500;">暂无数据</div>
                            <div style="font-size: 13px; color: var(--gray-500);">请尝试调整筛选条件</div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div style="display: flex; justify-content: center; align-items: center; padding: 20px; gap: 12px; border-top: 1px solid var(--gray-200);">
                        <button class="btn-default" disabled style="padding: 6px 12px; font-size: 13px; height: auto;">上一页</button>
                        <span style="font-size: 13px; color: var(--gray-600);" id="singerPaginationInfo">1 / 1</span>
                        <button class="btn-default" disabled style="padding: 6px 12px; font-size: 13px; height: auto;">下一页</button>
                    </div>
                </div>
            </div>
        `
    },
    'order-page': {
        title: '订单管理',
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>客户名称</label><select><option>全部</option><option>客户A</option><option>客户B</option></select></div>
                    <div class="filter-item"><label>订单性质</label><select><option>全部</option><option>买断</option><option>分成</option><option>独家</option><option>分成-独家</option><option>非独家</option><option>共同开发</option><option>仅需要配合/接收</option><option>申请提取</option></select></div>
                    <div class="filter-item"><label>生产周期</label><select><option>全部</option><option>长期</option><option>批次</option><option>单次</option></select></div>
                    <div class="filter-item"><label>生产进度</label><select><option>全部</option><option>待启动</option><option>生产中</option><option>部分交付</option><option>已完成</option><option>已终止</option></select></div>
                    <div class="filter-item" style="min-width: 320px;">
                        <label>创建时间</label>
                        <div class="date-range-picker">
                            <input type="date" placeholder="开始日期">
                            <span>至</span>
                            <input type="date" placeholder="结束日期">
                        </div>
                    </div>
                    <div class="filter-actions">
                        <button class="btn-primary">查询</button>
                        <button class="btn-default">重置</button>
                    </div>
                </div>
            </div>
            <div class="action-bar">
                <button class="btn-primary" onclick="openOrderModal()"><i class="fas fa-plus"></i> 新增订单</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>订单编号</th><th>订单名称</th><th>客户名称</th><th>生产类型</th><th>订单性质</th><th>生产周期</th><th>批次数量</th><th>需求数量</th><th>交付数量</th><th>生产进度</th><th>创建时间</th><th>创建人</th><th>备注</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr data-reference-files="需求说明.pdf|demo_reference.mp3"><td>DJ202604180001</td><td>需求管理系统开发</td><td>客户A</td><td>全案、DJ</td><td>共同开发</td><td>长期</td><td>3</td><td>44</td><td>30</td><td><span class="badge badge-blue">部分交付</span></td><td>2026-04-12 10:18:32</td><td>张三</td><td>长期合作订单</td><td><button class="btn-text" onclick="openOrderModalFromRow(this)">编辑</button><button class="btn-text" onclick="openAddBatchDrawer(this)">新增批次</button><button class="btn-text" onclick="openModal('modal-log')">操作日志</button></td></tr>
                        <tr data-reference-files=""><td>YQ202604180002</td><td>用户权限模块优化</td><td>客户C</td><td>Beat</td><td>仅需要配合/接收</td><td>长期</td><td>0</td><td>0</td><td>0</td><td><span class="badge badge-gray">待启动</span></td><td>2026-04-15 14:22:09</td><td>李四</td><td>-</td><td><button class="btn-text" onclick="openOrderModalFromRow(this)">编辑</button><button class="btn-text" onclick="openAddBatchDrawer(this)">新增批次</button><button class="btn-text" onclick="openModal('modal-log')">操作日志</button></td></tr>
                        <tr data-reference-files="歌词参考.txt|原曲参考.wav|授权材料.docx"><td>YQ202604180003</td><td>数据报表功能</td><td>客户D</td><td>Hit</td><td>申请提取</td><td>批次</td><td>2</td><td>120</td><td>120</td><td><span class="badge badge-green">已完成</span></td><td>2026-04-10 09:35:47</td><td>王五</td><td>重点批次交付</td><td><button class="btn-text" onclick="openOrderModalFromRow(this)">编辑</button><button class="btn-text" onclick="openAddBatchDrawer(this)">新增批次</button><button class="btn-text" onclick="openModal('modal-log')">操作日志</button></td></tr>
                        <tr data-reference-files=""><td>YQ202604180004</td><td>数据中台联调</td><td>客户B</td><td>全案</td><td>分成</td><td>单次</td><td>1</td><td>20</td><td>0</td><td><span class="badge badge-orange">生产中</span></td><td>2026-04-18 16:05:21</td><td>赵六</td><td>新增测试订单</td><td><button class="btn-text" onclick="openOrderModalFromRow(this)">编辑</button><button class="btn-text" onclick="openAddBatchDrawer(this)">新增批次</button><button class="btn-text" onclick="openModal('modal-log')">操作日志</button></td></tr>
                        <tr data-reference-files="原曲参考.wav"><td>YQ202604180005</td><td>终止测试订单</td><td>客户E</td><td>混音</td><td>买断</td><td>批次</td><td>1</td><td>30</td><td>0</td><td><span class="badge badge-red">已终止</span></td><td>2026-04-19 10:28:16</td><td>钱七</td><td>客户暂停推进</td><td><button class="btn-text" onclick="openOrderModalFromRow(this)">编辑</button><button class="btn-text" onclick="openAddBatchDrawer(this)">新增批次</button><button class="btn-text" onclick="openModal('modal-log')">操作日志</button></td></tr>
                    </tbody>
                </table>
            </div>
                <div class="pagination">
                    <span>共 150 条</span>
                    <select class="page-size-select"><option>50条/页</option><option>100条/页</option></select>
                    <button class="page-btn"><i class="fas fa-chevron-left"></i></button>
                    <button class="page-btn">1</button><button class="page-btn dots">...</button><button class="page-btn">98</button><button class="page-btn">99</button><button class="page-btn">100</button><button class="page-btn active">101</button><button class="page-btn">102</button>
                    <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `
    },
    'batch-page': {
        title: '批次管理',
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>批次编号</label><input type="text" placeholder="搜索批次编号"></div>
                    <div class="filter-item"><label>生产进度</label><select><option>全部</option><option>待生产</option><option>生产中</option><option>待交付</option><option>已终止</option><option>部分交付</option><option>已交付</option><option>已完结</option></select></div>
                    <div class="filter-item"><label>订单名称</label><select><option>全部</option></select></div>
                    <div class="filter-item"><label>工作流</label><select><option>全部</option></select></div>
                    <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                </div>
            </div>
            <div class="action-bar">
                <button class="btn-primary" onclick="openAddBatchDrawer()"><i class="fas fa-plus"></i> 新增批次</button>
                <button class="btn-default"><i class="fas fa-download"></i> 下载</button>
            </div>
            <div class="batch-summary-bar">
                <span class="batch-summary-dot"></span>
                <span>共<strong>7</strong>个批次</span>
                <span>需求总数量<strong>510</strong>首</span>
                <span>生产完成<strong>335</strong>首</span>
                <span>领用数量<strong>68</strong>首</span>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>批次编号</th><th>批次名称</th><th>订单名称</th><th>需求数量</th><th>生产完成数量</th><th>领用数量</th><th>生产进度</th><th>生产类型</th><th>制作方式</th><th>工作流</th><th>预计交付周期（天）</th><th>创建时间</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr><td>PC202604200001</td><td>4 月 500 首草原风</td><td>需求管理系统开发</td><td>100</td><td>0</td><td>0</td><td><span class="badge badge-gray">待生产</span></td><td>全案</td><td>全案</td><td>工作流1</td><td>23</td><td>2026-05-06 12:22:22</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button><button class="btn-text" onclick="openAddBatchDrawer(null, 'edit')">编辑</button><button class="btn-text danger" style="color:var(--danger)" onclick="finishBatch(this)">完结</button></td></tr>
                        <tr><td>PC202604210002</td><td>30 首草原风</td><td>需求管理系统开发</td><td>50</td><td>25</td><td>0</td><td><span class="badge badge-orange">生产中</span></td><td>Hit</td><td>Hit</td><td>工作流2</td><td>44</td><td>2026-05-06 12:22:22</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button><button class="btn-text" onclick="openAddBatchDrawer(null, 'edit')">编辑</button><button class="btn-text danger" style="color:var(--danger)" onclick="finishBatch(this)">完结</button></td></tr>
                        <tr><td>PC202604250006</td><td>7 月 60 首国风</td><td>数据报表功能</td><td>60</td><td>60</td><td>0</td><td><span class="badge badge-purple">待交付</span></td><td>全案</td><td>全案</td><td>工作流2</td><td>21</td><td>2026-05-12 11:24:36</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button><button class="btn-text" onclick="openAddBatchDrawer(null, 'edit')">编辑</button><button class="btn-text" style="color:var(--danger)" onclick="navigateTo('batch-delivery-page')">交付</button><button class="btn-text danger" style="color:var(--danger)" onclick="finishBatch(this)">完结</button></td></tr>
                        <tr><td>PC202604220003</td><td>20 首 DJ</td><td>用户权限模块优化</td><td>80</td><td>30</td><td>0</td><td><span class="badge badge-red">已终止</span></td><td>DJ</td><td>DJ</td><td>工作流1</td><td>55</td><td>2026-05-06 12:22:22</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button><button class="btn-text" onclick="openAddBatchDrawer(null, 'edit')">编辑</button></td></tr>
                        <tr><td>PC202604230004</td><td>5 月 120 首流行</td><td>数据报表功能</td><td>120</td><td>80</td><td>68</td><td><span class="badge badge-blue">部分交付</span></td><td>全案</td><td>全案</td><td>工作流2</td><td>30</td><td>2026-05-08 09:18:45</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button><button class="btn-text" onclick="openAddBatchDrawer(null, 'edit')">编辑</button><button class="btn-text" style="color:var(--danger)" onclick="navigateTo('batch-delivery-page')">交付</button><button class="btn-text danger" style="color:var(--danger)" onclick="finishBatch(this)">完结</button></td></tr>
                        <tr><td>PC202604240005</td><td>6 月 100 首民谣</td><td>数据中台联调</td><td>100</td><td>100</td><td>100</td><td><span class="badge badge-green">已交付</span></td><td>Hit</td><td>Hit</td><td>工作流3</td><td>28</td><td>2026-05-10 16:30:12</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button><button class="btn-text" onclick="openAddBatchDrawer(null, 'edit')">编辑</button></td></tr>
                        <tr><td>PC202604260007</td><td>7 月 70 首年轻流行</td><td>数据中台联调</td><td>70</td><td>70</td><td>40</td><td><span class="badge badge-gray">已完结</span></td><td>全案</td><td>全案</td><td>工作流3</td><td>35</td><td>2026-05-14 10:26:18</td><td><button class="btn-text" onclick="navigateTo('batch-detail-page')">详情</button></td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    'customer-page': {
        title: '客户管理',
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>客户名称</label><input type="text" placeholder="输入客户名称"></div>
                    <div class="filter-item"><label>状态</label><select><option>全部</option><option>启用</option><option>禁用</option></select></div>
                    <div class="filter-item"><label>对接人</label><input type="text" placeholder="输入对接人"></div>
                    <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                </div>
            </div>
            <div class="action-bar"><button class="btn-primary" onclick="openCustomerDrawer()"><i class="fas fa-plus"></i> 新增客户</button></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>客户编号</th><th>客户名称</th><th>公司名称</th><th>客户类型</th><th>制作需求</th><th>客户业务线</th><th>推进状态</th><th>优先级</th><th>对接人</th><th>进展备注</th><th>状态</th><th>创建时间</th><th>创建人</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr><td>OP-001</td><td>番茄畅听</td><td>番茄畅听</td><td><span class="badge badge-blue">平台方</span></td><td>DJ、伴奏</td><td>AI音乐线</td><td>长期合作中</td><td><span class="badge badge-red">P0</span></td><td>王武</td><td>备注示例</td><td><span class="badge badge-green">启用</span></td><td>2026-04-12</td><td>张三</td><td><button class="btn-text" onclick="openCustomerDrawer()">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要禁用该客户吗？')">禁用</button></td></tr>
                        <tr><td>MP-001</td><td>客户六</td><td>公司</td><td><span class="badge badge-gray">版权方</span></td><td>抢热度、翻译</td><td>仅需要配合/接收</td><td>合同签署</td><td><span class="badge badge-red">P0</span></td><td>孙尚香</td><td>备注示例</td><td><span class="badge badge-red">禁用</span></td><td>2026-04-15</td><td>李四</td><td><button class="btn-text" onclick="openCustomerDrawer()">编辑</button><button class="btn-text success" onclick="openConfirmDialog('确定要启用该客户吗？')">启用</button></td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    'staff-page': {
        title: '人员管理',
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入姓名"></div>
                    <div class="filter-item"><label>手机号</label><input type="text" placeholder="请输入手机号"></div>
                    <div class="filter-item"><label>状态</label><select><option>全部</option></select></div>
                    <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                </div>
            </div>
            <div class="action-bar"><button class="btn-primary" onclick="openModal('modal-add-staff')"><i class="fas fa-plus"></i> 新增人员</button></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>姓名</th><th>手机号</th><th>角色名称</th><th>标签</th><th>最大任务数</th><th>状态</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr><td>张三</td><td>13800138001</td><td>系统管理员</td><td>React, TypeScript, 前端</td><td>10</td><td><span class="badge badge-green">启用</span></td><td><button class="btn-text" onclick="openModal('modal-add-staff')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要禁用该人员吗？')">禁用</button><button class="btn-text danger" onclick="openConfirmDialog('确定要重置该人员的密码吗？')">重置密码</button></td></tr>
                        <tr><td>李四</td><td>13800138002</td><td>项目经理</td><td>Node.js, 后端</td><td>8</td><td><span class="badge badge-green">启用</span></td><td><button class="btn-text" onclick="openModal('modal-add-staff')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要禁用该人员吗？')">禁用</button><button class="btn-text danger" onclick="openConfirmDialog('确定要重置该人员的密码吗？')">重置密码</button></td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    'order-detail-page': {
        title: '订单详情',
        content: `
            <div class="detail-header">
                <div class="detail-back" onclick="navigateTo('order-page', document.querySelector('[data-page=order-page]'))"><i class="fas fa-arrow-left"></i> 返回</div>
            </div>
            <div class="info-card">
                <h4>订单信息</h4>
                <div class="info-grid order-detail-info-grid">
                    <div class="info-item order-detail-info-item"><span class="info-label">订单名称：</span><span class="info-value">25 年 4 月 300首</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">订单编号：</span><span class="info-value">PC202604225687</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">客户名称：</span><span class="info-value">番茄畅听</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">生产类型：</span><span class="info-value">全案、DJ</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">生产进度：</span><span class="info-value">部分交付</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">生产周期：</span><span class="info-value">长期</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">需求数量：</span><span class="info-value">44</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">交付数量：</span><span class="info-value">30</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">订单性质：</span><span class="info-value">买断</span></div>
                    <div class="info-item order-detail-info-item"><span class="info-label">项目批次：</span><span class="info-value">第一批次、第二批次...</span></div>
                    <div class="info-item order-detail-info-item order-detail-remark-item" data-tooltip="这是几个备注，可以很长哦。这里展示订单补充说明，最多按两行信息展示，超出内容鼠标划过后通过气泡展示完整内容，便于快速查看订单补充说明。"><span class="info-label">备注：</span><span class="info-value">这是几个备注，可以很长哦。这里展示订单补充说明，最多按两行信息展示，超出内容鼠标划过后通过气泡展示完整内容，便于快速查看订单补充说明。</span></div>
                    <div class="info-item order-detail-info-item order-detail-info-item-full order-detail-reference-item">
                        <span class="info-label">参考资料：</span>
                        <span class="info-value order-detail-reference-list">
                            <span class="order-detail-reference-file order-detail-reference-audio">
                                <span class="order-detail-reference-file-head">
                                    <span class="node-config-file-icon"><i class="fas fa-music"></i></span>
                                    <span class="node-config-file-name">demo_reference.mp3</span>
                                    <a class="btn-text order-detail-reference-download" href="https://www.w3schools.com/html/horse.mp3" download="demo_reference.mp3">下载</a>
                                </span>
                                <audio controls>
                                    <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                                </audio>
                            </span>
                            <span class="order-detail-reference-file order-detail-reference-audio">
                                <span class="order-detail-reference-file-head">
                                    <span class="node-config-file-icon"><i class="fas fa-music"></i></span>
                                    <span class="node-config-file-name">原曲参考.wav</span>
                                    <a class="btn-text order-detail-reference-download" href="https://www.w3schools.com/html/horse.mp3" download="原曲参考.wav">下载</a>
                                </span>
                                <audio controls>
                                    <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
                                </audio>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="info-card" style="margin-bottom: 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--gray-200); padding-bottom:8px; gap: 16px;">
                    <h4 style="margin:0; border:none; padding:0;">歌曲清单</h4>
                    <select id="orderSongBatchFilter" onchange="filterOrderSongListByBatch()" style="padding:4px 8px; border:1px solid var(--gray-300); border-radius:4px;">
                        <option value="">全部批次</option>
                        <option value="2月 300首">2月 300首</option>
                        <option value="6月 300首">6月 300首</option>
                        <option value="4月 300首">4月 300首</option>
                    </select>
                </div>
                <div style="display: flex; gap: 32px; border-bottom: 1px solid var(--gray-200); margin-bottom: 16px;">
                    <div id="orderSongFlowTab" onclick="switchOrderSongTab('flow')" style="font-size: 16px; font-weight: 600; color: var(--primary); cursor: pointer; border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: -1px;">制作</div>
                    <div id="orderSongProductTab" onclick="switchOrderSongTab('product')" style="font-size: 16px; font-weight: 500; color: var(--gray-600); cursor: pointer; border-bottom: 2px solid transparent; padding-bottom: 10px; margin-bottom: -1px;">成品</div>
                </div>
                <div id="orderSongFlowTable" class="table-container order-song-table-panel" style="box-shadow: none; border: 1px solid var(--gray-200);">
                    <table class="data-table">
                        <thead><tr><th>批次名称</th><th>流水编号</th><th>歌曲原名</th><th>交付歌名</th><th>当前节点</th><th>当前执行人</th><th>制作状态</th><th>交付时间</th></tr></thead>
                        <tbody>
                            <tr data-batch="2月 300首"><td>2月 300首</td><td>FLOW2026022300001</td><td>泪似桃花瓣飘落溪</td><td>泪似桃花瓣飘落溪</td><td>作曲</td><td>张三</td><td><span class="badge badge-red">已终止</span></td><td>2026-02-23</td></tr>
                            <tr data-batch="6月 300首"><td>6月 300首</td><td>FLOW2026060200001</td><td>这一路</td><td>这一路</td><td>曲审核</td><td>李四</td><td><span class="badge badge-blue">进行中</span></td><td>-</td></tr>
                            <tr data-batch="4月 300首"><td>4月 300首</td><td>FLOW2026040200001</td><td>执念</td><td>执念</td><td>-</td><td>王五</td><td><span class="badge badge-green">已完成</span></td><td>2026-02-23</td></tr>
                        </tbody>
                    </table>
                </div>
                <div id="orderSongProductTable" class="table-container order-song-table-panel" style="display:none; box-shadow: none; border: 1px solid var(--gray-200);">
                    <table class="data-table">
                        <thead><tr><th>批次名称</th><th>成品编号</th><th>歌名</th><th>歌曲编号</th><th>成品音频</th><th>交付状态</th><th>创建人</th><th>创建时间</th></tr></thead>
                        <tbody>
                            <tr data-batch="2月 300首"><td>2月 300首</td><td>CP-001</td><td>泪似桃花瓣飘落溪</td><td>AIB-001</td><td>文件</td><td><span class="badge badge-gray">未交付</span></td><td>张三</td><td>2026-02-23</td></tr>
                            <tr data-batch="6月 300首"><td>6月 300首</td><td>CP-002</td><td>这一路</td><td>AIB-002</td><td>文件</td><td><span class="badge badge-blue">交付中</span></td><td>李四</td><td>2026-06-12</td></tr>
                            <tr data-batch="4月 300首"><td>4月 300首</td><td>CP-003</td><td>执念</td><td>AIB-003</td><td>文件</td><td><span class="badge badge-green">已交付</span></td><td>王五</td><td>2026-04-18</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },

    'add-batch-page': {
        title: '批次管理-新增批次',
        content: `
            <div class="detail-header"><div class="detail-back" onclick="navigateTo('batch-page', document.querySelector('[data-page=batch-page]'))"><i class="fas fa-arrow-left"></i> 返回</div></div>
            <div class="info-card">
                <h4 style="color:var(--primary); border-left:4px solid var(--primary); padding-left:8px; border-bottom:none; margin-bottom:20px;">订单与交付承诺</h4>
                <div class="form-row">
                    <div class="form-group"><label>订单名称 *</label><select><option>选择订单</option><option>需求管理系统开发</option></select></div>
                    <div class="form-group"><label>批次名称 *</label><input type="text" placeholder="请输入批次名称"></div>
                    <div class="form-group"><label>预计交付周期 (天) *</label><input type="number" placeholder="请输入天数"></div>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex: 0 0 32%;"><label>需求数量 *</label><input type="number" placeholder="请输入数量"></div>
                </div>
            </div>
            <div class="info-card">
                <h4 style="color:var(--primary); border-left:4px solid var(--primary); padding-left:8px; border-bottom:none; margin-bottom:20px;">生产与需求</h4>
                <div class="form-row">
                    <div class="form-group"><label>生产类型 *</label><select><option>全案</option></select></div>
                    <div class="form-group"><label>制作方式 *</label><select><option>全案</option></select></div>
                    <div class="form-group"><label>生产需求 *</label><input type="text" placeholder="请输入生产需求"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>客户需求</label><input type="text" placeholder="请输入客户需求"></div>
                    <div class="form-group"><label>客户定制化自动化</label><input type="text" placeholder="请输入客户定制化自动化"></div>
                    <div class="form-group"><label>备注</label><input type="text" placeholder="请输入备注信息"></div>
                </div>
            </div>
            <div class="info-card">
                <h4 style="color:var(--primary); border-left:4px solid var(--primary); padding-left:8px; border-bottom:none; margin-bottom:20px;">工作流</h4>
                <div class="form-row">
                    <div class="form-group" style="flex: 0 0 32%;"><label>工作流 *</label><select data-batch-workflow-select><option>全案工作流</option></select></div>
                </div>
                <p style="color:var(--primary); font-size:13px; margin: 10px 0;">当前工作流：全案工作流</p>
                <div style="display:flex; align-items:center; gap:10px; font-size:13px;">
                    <span style="background:#FFF0E5; color:#FA8C16; padding:4px 12px; border-radius:20px; border:1px solid #FFD591;">01 作词</span>
                    <i class="fas fa-arrow-right" style="color:var(--gray-400)"></i>
                    <span style="background:#FFF0E5; color:#FA8C16; padding:4px 12px; border-radius:20px; border:1px solid #FFD591;">02 作词审核</span>
                    <i class="fas fa-arrow-right" style="color:var(--gray-400)"></i>
                    <span style="background:#F0F5FF; color:#2F54EB; padding:4px 12px; border-radius:20px; border:1px solid #ADC6FF;">03 作曲</span>
                    <i class="fas fa-arrow-right" style="color:var(--gray-400)"></i>
                    <span style="background:#FFF0E5; color:#FA8C16; padding:4px 12px; border-radius:20px; border:1px solid #FFD591;">04 作曲审核</span>
                </div>
            </div>
            <div class="info-card" style="margin-bottom:80px;">
                <h4 style="color:var(--primary); border-left:4px solid var(--primary); padding-left:8px; border-bottom:none; margin-bottom:10px; display:inline-block;">成品库领用</h4>
                <span style="font-size:12px; color:var(--gray-500);">(选择已有的成品歌曲加入本次批次)</span>
                <div style="margin-top:16px;">
                    <button class="btn-primary" onclick="openModal('modal-claim-product')">从成品库领用歌曲</button>
                </div>
            </div>
            <div style="position:fixed; bottom:0; left:200px; right:0; background:#fff; padding:16px 24px; border-top:1px solid var(--gray-200); display:flex; justify-content:flex-end; align-items:center; gap:16px; box-shadow:0 -2px 10px rgba(0,0,0,0.05);">
                <div style="font-size:14px;">已领用：<span style="color:var(--danger)">0</span> 首 &nbsp;&nbsp; 待制作：<span style="color:var(--primary)">100</span> 首</div>
                <button class="btn-default" onclick="navigateTo('batch-page')">取消</button>
                <button class="btn-primary" onclick="navigateTo('batch-page')">确认提交</button>
            </div>
        `
    },
    'batch-detail-page': {
        title: '批次管理-批次详情',
        content: `
            <div class="detail-header">
                <div class="detail-back" onclick="navigateTo('batch-page', document.querySelector('[data-page=batch-page]'))"><i class="fas fa-arrow-left"></i> 返回批次列表</div>
            </div>
            <div class="info-card" style="padding-bottom:0; box-shadow:none;">
                <h4 style="font-size:15px; font-weight:600; margin-bottom:16px;">基础信息</h4>
                <table class="data-table" style="margin-bottom: 24px; border: 1px solid var(--gray-200);">
                    <tbody>
                        <tr><td style="background:var(--gray-100);width:10%;text-align:center;">批次名称</td><td style="width:15%">25 年 4 月 300首</td><td style="background:var(--gray-100);width:10%;text-align:center;">批次编号</td><td style="width:15%">PC202604225687</td><td style="background:var(--gray-100);width:10%;text-align:center;">生产进度</td><td style="width:15%"><span class="badge badge-orange">待交付</span></td><td style="background:var(--gray-100);width:10%;text-align:center;">需求数量</td><td style="width:15%">44</td></tr>
                        <tr><td style="background:var(--gray-100);text-align:center;">生产类型</td><td>全案</td><td style="background:var(--gray-100);text-align:center;">生产完成数量</td><td>40</td><td style="background:var(--gray-100);text-align:center;">领用数量</td><td>12</td><td style="background:var(--gray-100);text-align:center;">制作方式</td><td>随意了</td></tr>
                        <tr><td style="background:var(--gray-100);text-align:center;">生产需求</td><td>生产需求</td><td style="background:var(--gray-100);text-align:center;">客户需求</td><td>客户需求</td><td style="background:var(--gray-100);text-align:center;">客户定制自动化</td><td>全自动作词流程</td><td style="background:var(--gray-100);text-align:center;">预计交付周期（天）</td><td>44</td></tr>
                        <tr><td style="background:var(--gray-100);text-align:center;">备注</td><td colspan="7">这里是备注有可能很重要哦</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="info-card" style="margin-bottom: 0;">
                <div style="display: flex; gap: 32px; border-bottom: 1px solid var(--gray-200); margin-bottom: 16px;">
                    <div id="batchDetailMakeTab" onclick="switchBatchDetailTab('make')" style="font-size: 16px; font-weight: 600; color: var(--primary); cursor: pointer; border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: -1px;">生产</div>
                    <div id="batchDetailProductTab" onclick="switchBatchDetailTab('product')" style="font-size: 16px; font-weight: 500; color: var(--gray-600); cursor: pointer; border-bottom: 2px solid transparent; padding-bottom: 10px; margin-bottom: -1px;">领用</div>
                </div>
                <div id="batchDetailMakePanel">
                    <div class="filter-bar" style="margin-bottom: 24px;">
                        <div class="filter-row">
                            <div class="filter-item"><label>成品编号</label><input type="text"></div>
                            <div class="filter-item"><label>状态</label><select><option>全部</option></select></div>
                            <div class="filter-item"><label>当前节点</label><select><option>全部</option></select></div>
                            <div class="filter-item"><label>当前执行人</label><div class="input-with-icon" style="border:1px solid var(--gray-300); border-radius:6px; padding:2px 8px; margin-top:2px;"><i class="fas fa-search"></i><input type="text" placeholder="搜索执行人" style="font-size:14px; padding:4px;"></div></div>
                            <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                        </div>
                    </div>
                    <div class="action-bar">
                        <button class="btn-primary" onclick="handleBatchEditStaffClick()">批量维护人员</button>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                    <thead><tr><th style="width:40px;"><input type="checkbox"></th><th>流水编号</th><th>对标歌名</th><th>歌名</th><th>成品编号</th><th>状态</th><th>当前节点</th><th>当前执行人</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr class="batch-flow-row" data-status="进行中" data-node="作词"><td><input type="checkbox" class="batch-flow-checkbox"></td><td>FLOW2026060200001</td><td>窗外</td><td>窗外</td><td>AIBae...fw</td><td class="batch-flow-status-cell"><span class="badge" style="border:1px solid #1677FF; color:#1677FF; background:transparent;">进行中</span></td><td class="batch-flow-node-cell">作词</td><td class="batch-flow-owner-cell">张三</td><td><button class="btn-text" onclick="openModal('modal-batch-flow-detail')">详情</button><button class="btn-text" onclick="openSingleStaffMaintenance(this)">人员维护</button><button class="btn-text danger" onclick="openConfirmDialog('终止确认', '确定终止该流水？终止后当前及后续节点将停止流转。', '确认终止')">终止</button></td></tr>
                        <tr class="batch-flow-row" data-status="已终止" data-node="作曲"><td><input type="checkbox" class="batch-flow-checkbox" disabled title="已终止流水不可参与批量维护"></td><td>FLOW2026060200002</td><td>他不懂</td><td>--</td><td>AIBae...fw</td><td class="batch-flow-status-cell"><span class="badge" style="border:1px solid #F5222D; color:#F5222D; background:transparent;">已终止</span></td><td class="batch-flow-node-cell">作曲</td><td class="batch-flow-owner-cell">李四</td><td><button class="btn-text" onclick="openModal('modal-batch-flow-detail')">详情</button></td></tr>
                        <tr class="batch-flow-row" data-status="已完成" data-node="-"><td><input type="checkbox" class="batch-flow-checkbox" disabled title="无当前运行节点，不可参与批量维护"></td><td>FLOW2026060200003</td><td>这就是爱</td><td>--</td><td>AIBae...fw</td><td class="batch-flow-status-cell"><span class="badge" style="border:1px solid #52C41A; color:#52C41A; background:transparent;">已完成</span></td><td class="batch-flow-node-cell">-</td><td class="batch-flow-owner-cell">王五</td><td><button class="btn-text" onclick="openModal('modal-batch-flow-detail')">详情</button></td></tr>
                        <tr class="batch-flow-row" data-status="进行中" data-node="作曲"><td><input type="checkbox" class="batch-flow-checkbox"></td><td>FLOW2026060200004</td><td>云中的angle</td><td>云中的angle</td><td>AIBae...fw</td><td class="batch-flow-status-cell"><span class="badge" style="border:1px solid #1677FF; color:#1677FF; background:transparent;">进行中</span></td><td class="batch-flow-node-cell">作曲</td><td class="batch-flow-owner-cell">赵六</td><td><button class="btn-text" onclick="openModal('modal-batch-flow-detail')">详情</button><button class="btn-text" onclick="openSingleStaffMaintenance(this)">人员维护</button><button class="btn-text danger" onclick="openConfirmDialog('终止确认', '确定终止该流水？终止后当前及后续节点将停止流转。', '确认终止')">终止</button></td></tr>
                        <tr class="batch-flow-row" data-status="执行失败" data-node="作曲"><td><input type="checkbox" class="batch-flow-checkbox"></td><td>FLOW2026060200005</td><td>晚风渡口</td><td>晚风渡口</td><td>AIBae...fw</td><td class="batch-flow-status-cell"><span class="badge" style="border:1px solid #FA541C; color:#FA541C; background:#FFF2E8;">执行失败</span></td><td class="batch-flow-node-cell">作曲</td><td class="batch-flow-owner-cell">钱七</td><td><button class="btn-text" onclick="openModal('modal-batch-flow-detail')">详情</button><button class="btn-text" onclick="openSingleStaffMaintenance(this)">人员维护</button><button class="btn-text danger" onclick="openConfirmDialog('终止确认', '确定终止该流水？终止后当前及后续节点将停止流转。', '确认终止')">终止</button></td></tr>
                        <tr class="batch-flow-row" data-status="待分配" data-node="作词"><td><input type="checkbox" class="batch-flow-checkbox"></td><td>FLOW2026060200006</td><td>--</td><td>--</td><td>AIBae...fw</td><td class="batch-flow-status-cell"><span class="badge badge-gray">待分配</span></td><td class="batch-flow-node-cell">作词</td><td class="batch-flow-owner-cell">-</td><td><button class="btn-text" onclick="openModal('modal-batch-flow-detail')">详情</button><button class="btn-text" onclick="openSingleStaffMaintenance(this)">人员维护</button><button class="btn-text danger" onclick="openConfirmDialog('终止确认', '确定终止该流水？终止后当前及后续节点将停止流转。', '确认终止')">终止</button></td></tr>
                    </tbody>
                </table>
            </div>
                </div>
                <div id="batchDetailProductPanel" style="display:none;">
                    <div class="filter-bar" style="margin-bottom: 24px;">
                        <div class="filter-row">
                            <div class="filter-item"><label>歌名</label><input type="text" id="batchClaimSongNameFilter" placeholder="请输入歌名"></div>
                            <div class="filter-item"><label>成品编号</label><input type="text" id="batchClaimSongCodeFilter" placeholder="请输入成品编号"></div>
                            <div class="filter-item"><label>歌手</label><input type="text" id="batchClaimSingerFilter" placeholder="请输入歌手"></div>
                            <div class="filter-actions"><button class="btn-primary" onclick="filterBatchClaimSongs()">查询</button><button class="btn-default" onclick="resetBatchClaimSongs()">重置</button></div>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead><tr><th>对标歌名</th><th>歌名</th><th>歌手</th><th>成品编号</th><th>歌词信息</th><th>音频信息</th></tr></thead>
                            <tbody>
                                <tr class="batch-claim-song-row"><td>窗外</td><td>窗外</td><td>虚拟歌手 小A</td><td>AIB-20260717-001</td><td>这是歌词内容...</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td></tr>
                                <tr class="batch-claim-song-row"><td>他不懂</td><td>他不懂</td><td>独立音乐人 B</td><td>AIB-20260717-002</td><td>这是歌词内容...</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td></tr>
                                <tr class="batch-claim-song-row"><td>这就是爱</td><td>这就是爱</td><td>歌手 C</td><td>AIB-20260717-003</td><td>这是歌词内容...</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `
    },
    'batch-delivery-page': {
        title: '批次管理-交付',
        content: `
            <div class="detail-header">
                <div class="detail-back" onclick="navigateTo('batch-page', document.querySelector('[data-page=batch-page]'))"><i class="fas fa-arrow-left"></i> 返回批次列表</div>
            </div>
            <div class="info-card" style="padding-bottom:0; box-shadow:none;">
                <h4 style="font-size:15px; font-weight:600; margin-bottom:16px;">基础信息</h4>
                <table class="data-table" style="margin-bottom: 24px; border: 1px solid var(--gray-200);">
                    <tbody>
                        <tr><td style="background:var(--gray-100);width:10%;text-align:center;">批次名称</td><td style="width:15%">25 年 4 月 300首</td><td style="background:var(--gray-100);width:10%;text-align:center;">批次编号</td><td style="width:15%">PC202604225687</td><td style="background:var(--gray-100);width:10%;text-align:center;">生产进度</td><td style="width:15%"><span class="badge badge-orange">待交付</span></td><td style="background:var(--gray-100);width:10%;text-align:center;">需求数量</td><td style="width:15%">44</td></tr>
                        <tr><td style="background:var(--gray-100);text-align:center;">生产类型</td><td>全案</td><td style="background:var(--gray-100);text-align:center;">生产完成数量</td><td>40</td><td style="background:var(--gray-100);text-align:center;">领用数量</td><td>12</td><td style="background:var(--gray-100);text-align:center;">制作方式</td><td>随意了</td></tr>
                        <tr><td style="background:var(--gray-100);text-align:center;">生产需求</td><td>生产需求</td><td style="background:var(--gray-100);text-align:center;">客户需求</td><td>客户需求</td><td style="background:var(--gray-100);text-align:center;">客户定制自动化</td><td>全自动作词流程</td><td style="background:var(--gray-100);text-align:center;">预计交付周期（天）</td><td>44</td></tr>
                        <tr><td style="background:var(--gray-100);text-align:center;">备注</td><td colspan="7">这里是备注有可能很重要哦</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="info-card">
                <h4 style="font-size:15px; font-weight:600; margin-bottom:16px;">版权信息</h4>
                <div class="form-row">
                    <div class="form-group"><label>商用情况 <span style="color:#F5222D">*</span></label><select><option>请选择商用情况</option><option>可商用</option><option>不可商用</option></select></div>
                    <div class="form-group"><label>授权地区 <span style="color:#F5222D">*</span></label><input type="text" placeholder="请输入授权地区"></div>
                    <div class="form-group"><label>发行地区 <span style="color:#F5222D">*</span></label><input type="text" placeholder="请输入发行地区"></div>
                    <div class="form-group"><label>版权情况 <span style="color:#F5222D">*</span></label><select><option>请选择版权情况</option><option>独家</option><option>非独家</option><option>买断</option><option>分成</option></select></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>授权时间</label><select id="batchDeliveryAuthDuration" onchange="updateBatchDeliveryAuthEndDate()"><option>请选择授权时间</option><option>一年</option><option>两年</option><option>三年</option><option>五年</option><option>永久</option></select></div>
                    <div class="form-group"><label>授权开始时间</label><input type="date" id="batchDeliveryAuthStartDate" value="2026-05-09" onchange="updateBatchDeliveryAuthEndDate()"></div>
                    <div class="form-group"><label>授权结束时间</label><input type="date" id="batchDeliveryAuthEndDate" value="2029-05-08" readonly class="input-disabled"></div>
                    <div class="form-group"><label>供应商信息</label><input type="text" placeholder="请输入供应商信息"></div>
                </div>
                <div class="form-group"><label>备注信息</label><textarea rows="3" placeholder="请输入备注信息"></textarea></div>
            </div>

            <div class="info-card" style="margin-bottom:80px;">
                <h4 style="font-size:15px; font-weight:600; margin-bottom:16px;">歌曲信息</h4>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                    <div style="font-size: 14px; color: var(--gray-800);">待交付歌曲：<span id="batchDeliveryCompletedCount">0</span> 首 &nbsp;|&nbsp; 领用：<span id="batchDeliveryClaimedCount">0</span> 首 &nbsp;|&nbsp; 制作：<span id="batchDeliveryMadeCount">0</span> 首</div>
                    <button class="btn-primary" onclick="alert('打包成功！')"><i class="fas fa-archive"></i> 打包</button>
                </div>
                <div class="table-container">
                    <table class="data-table" id="batchDeliveryTable">
                        <thead><tr><th style="width:40px;"><input type="checkbox" onchange="toggleBatchDeliveryAll(this)"></th><th>对标歌名</th><th>歌名</th><th>歌手</th><th>成品编号</th><th>歌词信息</th><th>音频信息</th><th>操作</th></tr></thead>
                        <tbody>
                            <tr data-source="制作"><td><input type="checkbox" class="batch-delivery-checkbox" onchange="updateBatchDeliverySelectedCount()"></td><td>窗外</td><td>窗外</td><td>虚拟歌手 小A</td><td>AlBeat-recuGx37YKvFkw</td><td>这个是歌词</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td><td><a class="btn-text" href="https://www.w3schools.com/html/horse.mp3" download="窗外.mp3">下载音频</a></td></tr>
                            <tr data-source="领用"><td><input type="checkbox" class="batch-delivery-checkbox" onchange="updateBatchDeliverySelectedCount()"></td><td>他不懂</td><td>他不懂</td><td>独立音乐人 B</td><td>AlBeat-recuGx37YKvFkw</td><td>这个是歌词</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td><td><a class="btn-text" href="https://www.w3schools.com/html/horse.mp3" download="他不懂.mp3">下载音频</a></td></tr>
                            <tr data-source="领用"><td><input type="checkbox" class="batch-delivery-checkbox" checked onchange="updateBatchDeliverySelectedCount()"></td><td>这就是爱</td><td>这就是爱</td><td>歌手 C</td><td>AlBeat-recuGx37YKvFkw</td><td>这个是歌词</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td><td><a class="btn-text" href="https://www.w3schools.com/html/horse.mp3" download="这就是爱.mp3">下载音频</a></td></tr>
                            <tr data-source="制作"><td><input type="checkbox" class="batch-delivery-checkbox" onchange="updateBatchDeliverySelectedCount()"></td><td>云中的angle</td><td>云中的angle</td><td>赵六</td><td>AlBeat-recuGx37YKvFkw</td><td>这个是歌词</td><td><div class="batch-inline-audio"><button class="batch-inline-audio-play" onclick="alert('播放音频')"><i class="fas fa-play"></i></button><span class="batch-inline-audio-time">00:00 / 03:45</span><span class="batch-inline-audio-track"></span><i class="fas fa-volume-up batch-inline-audio-volume"></i></div></td><td><a class="btn-text" href="https://www.w3schools.com/html/horse.mp3" download="云中的angle.mp3">下载音频</a></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="position:fixed; bottom:0; left:200px; right:0; background:#fff; padding:16px 24px; border-top:1px solid var(--gray-200); display:flex; justify-content:flex-end; align-items:center; gap:16px; box-shadow:0 -2px 10px rgba(0,0,0,0.05); z-index:100;">
                <div style="font-size:14px;">共选取：<span id="batchDeliverySelectedCount" style="color:var(--danger); font-weight:600;">0</span> 首</div>
                <button class="btn-default" onclick="navigateTo('batch-page')">取消</button>
                <button class="btn-primary" onclick="handleBatchDeliverySubmit()">确认交付</button>
            </div>
        `
    },
    'product-page': {
        title: '成品管理',
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>订单名称</label><input type="text" placeholder="请输入订单名称"></div>
                    <div class="filter-item"><label>批次名称</label><input type="text" placeholder="请输入批次名称"></div>
                    <div class="filter-item"><label>订单编号</label><input type="text" placeholder="请输入订单编号"></div>
                    <div class="filter-item"><label>批次编号</label><input type="text" placeholder="请输入批次编号"></div>
                </div>
                <div class="filter-row">
                    <div class="filter-item"><label>歌名</label><input type="text" placeholder="请输入歌名"></div>
                    <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                </div>
            </div>
            <div class="action-bar"><button class="btn-primary" onclick="openModal('modal-add-product')"><i class="fas fa-plus"></i> 新增成品</button></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>所属订单</th><th>所属批次</th><th>歌名</th><th>歌曲编号</th><th>词信息</th><th>作词人</th><th>曲信息</th><th>作曲人</th><th>歌手</th><th>创建时间</th><th>完成时间</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr><td>订单 1</td><td>001</td><td>窗外</td><td>AIBeat-recuGx37YKvfkw</td><td>这是歌词</td><td>张三</td><td>曲信息</td><td>张三</td><td>张三</td><td>2026-05-10 10:00:00</td><td>2026-05-15 11:22:23</td><td><button class="btn-text" onclick="openModal('modal-add-product')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要删除该成品吗？')">删除</button></td></tr>
                        <tr><td>订单 2</td><td>002</td><td>他不懂</td><td>AIBeat-recuGx37YKvfkw</td><td>这是歌词</td><td>李四</td><td>曲信息</td><td>李四</td><td>李四</td><td>2026-05-10 10:30:00</td><td>2026-05-15 11:22:23</td><td><button class="btn-text" onclick="openModal('modal-add-product')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要删除该成品吗？')">删除</button></td></tr>
                        <tr><td>订单 3</td><td>003</td><td>这就是爱</td><td>AIBeat-recuGx37YKvfkw</td><td>歌词</td><td>王五</td><td>曲信息</td><td>王五</td><td>王五</td><td>2026-05-11 09:00:00</td><td>2026-05-15 11:22:23</td><td><button class="btn-text" onclick="openModal('modal-add-product')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要删除该成品吗？')">删除</button></td></tr>
                        <tr><td>订单 4</td><td>004</td><td>云中的angle</td><td>AIBeat-recuGx37YKvfkw</td><td>歌词</td><td>赵六</td><td>曲信息</td><td>赵六</td><td>赵六</td><td>2026-05-12 14:00:00</td><td>2026-05-15 11:22:23</td><td><button class="btn-text" onclick="openModal('modal-add-product')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确定要删除该成品吗？')">删除</button></td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    'copyright-confirm-page': {
        title: '版权导入信息确认',
        content: `
            <div class="info-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; border-left:4px solid var(--primary); padding-left:8px;">成品信息</h3>
                <table class="data-table">
                    <thead><tr><th>歌曲原名</th><th>交付歌名</th><th>风格</th><th>成曲歌词</th><th>作词信息</th><th>成曲音频</th><th>作曲信息</th><th>制作时间</th></tr></thead>
                    <tbody>
                        <tr><td>泪似桃花瓣飘落溪</td><td>泪似桃花瓣飘落溪</td><td>古风</td><td>执红烛轻扫眉笔...</td><td>张三</td><td>文件</td><td>张三</td><td>2026-02-23</td></tr>
                        <tr><td>这一路</td><td>这一路</td><td>民谣</td><td>这里是歌词...</td><td>李四</td><td>这里是文件</td><td>李四</td><td>2026-02-23</td></tr>
                        <tr><td>执念</td><td>执念</td><td>民谣</td><td>这里是歌词...</td><td>王五</td><td>这里是文件</td><td>王五</td><td>2026-02-23</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="info-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; border-left:4px solid var(--primary); padding-left:8px;">客户信息</h3>
                <table class="data-table">
                    <thead><tr><th>客户编号</th><th>客户名称</th><th>公司名称</th><th>客户类型</th><th>制作要求</th><th>业务线</th><th>推进状态</th><th>优先级</th><th>对接人</th><th>状态</th><th>制作时间</th></tr></thead>
                    <tbody>
                        <tr><td>OP-002</td><td>客户 q</td><td>客户 q</td><td><span class="badge" style="color:#1677FF;background:#E6F4FF;">平台方</span></td><td>DJ、全案</td><td>共同开发</td><td><span style="color:#1677FF;">长期合作中</span></td><td><span class="badge" style="color:#F5222D;background:#FFF1F0;">P0</span></td><td>张三</td><td><span class="badge" style="color:#1677FF;background:#E6F4FF;">启用</span></td><td>2026-02-23</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="info-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; border-left:4px solid var(--primary); padding-left:8px;">订单信息</h3>
                <table class="data-table">
                    <thead><tr><th>订单编号</th><th>订单名称</th><th>客户名称</th><th>生产类型</th><th>订单性质</th><th>生产周期</th><th>项目批次</th><th>生产金曲</th><th>创建人</th><th>创建时间</th><th>版权生效时间</th><th>备注</th></tr></thead>
                    <tbody>
                        <tr><td>DJ-20260518-002</td><td>DJ30 首</td><td>客户 q</td><td>DJ、全案</td><td>共同开发</td><td>长期</td><td>0518 第一批</td><td><span class="badge" style="color:#1677FF;background:#E6F4FF;">持续交付</span></td><td>系统</td><td>2026-02-23</td><td>2026-02-23至<br>2027-02-23</td><td>-</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="info-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; border-left:4px solid var(--primary); padding-left:8px;">批次信息</h3>
                <table class="data-table">
                    <thead><tr><th>订单名称</th><th>订单名称</th><th>批次编号</th><th>需求数量</th><th>领用数量</th><th>生产进度</th><th>生产类型</th><th>制作方式</th><th>预计交付周期(天)</th><th>创建人</th><th>创建时间</th></tr></thead>
                    <tbody>
                        <tr><td>DJ30 首</td><td>0518 第一批</td><td>PC-20260518-002</td><td>0</td><td>30</td><td><span class="badge" style="color:#1677FF;background:#E6F4FF;">已交付</span></td><td>DJ、全案</td><td>全案</td><td>30</td><td>系统</td><td>2026-05-19<br>12:12:22</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="info-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; border-left:4px solid var(--primary); padding-left:8px;">版权信息</h3>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; font-size:14px;">
                    <div><span style="color:var(--gray-500)">授权开始时间：</span> 2026-05-19</div>
                    <div><span style="color:var(--gray-500)">授权结束时间：</span> 2029-05-19</div>
                    <div><span style="color:var(--gray-500)">发行日期：</span> 2026-05-19</div>
                    <div><span style="color:var(--gray-500)">上线日期：</span> 2026-05-19</div>
                    <div><span style="color:var(--gray-500)">下架时间：</span> -</div>
                    <div><span style="color:var(--gray-500)">授权时间：</span> 客户需求</div>
                    <div><span style="color:var(--gray-500)">授权地区：</span> 随意了</div>
                    <div><span style="color:var(--gray-500)">发行地区：</span> 44</div>
                    <div><span style="color:var(--gray-500)">版权情况：</span> 全部版权</div>
                    <div><span style="color:var(--gray-500)">在线状态：</span> 在线</div>
                    <div><span style="color:var(--gray-500)">上架平台：</span> 在线</div>
                    <div><span style="color:var(--gray-500)">端口应上线平台：</span> 在线</div>
                    <div><span style="color:var(--gray-500)">发行端口：</span> 在线</div>
                    <div><span style="color:var(--gray-500)">分成比例：</span> 在线</div>
                    <div><span style="color:var(--gray-500)">商用情况：</span> 在线</div>
                    <div><span style="color:var(--gray-500)">外显歌手：</span> 急急急</div>
                    <div><span style="color:var(--gray-500)">外显词作者：</span> 急急急</div>
                    <div><span style="color:var(--gray-500)">外显曲作者：</span> 急急急</div>
                    <div><span style="color:var(--gray-500)">上线外显：</span> 急急急</div>
                </div>
            </div>
            
            <div class="info-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; border-left:4px solid var(--primary); padding-left:8px;">交付信息</h3>
                <table class="data-table">
                    <thead><tr><th>歌曲原名</th><th>交付歌名</th><th>风格</th><th>成曲歌词</th><th>作词信息</th><th>成曲音频</th><th>作曲信息</th><th>制作时间</th></tr></thead>
                    <tbody>
                        <tr><td>泪似桃花瓣飘落溪</td><td>泪似桃花瓣飘落溪</td><td>古风</td><td>执红烛轻扫眉笔...</td><td>张三</td><td>文件</td><td>张三</td><td>2026-02-23</td></tr>
                        <tr><td>这一路</td><td>这一路</td><td>民谣</td><td>这里是歌词...</td><td>李四</td><td>这里是文件</td><td>李四</td><td>2026-02-23</td></tr>
                        <tr><td>执念</td><td>执念</td><td>民谣</td><td>这里是歌词...</td><td>王五</td><td>这里是文件</td><td>王五</td><td>2026-02-23</td></tr>
                    </tbody>
                </table>
            </div>

            <div style="display:flex; justify-content:flex-end; align-items:center; gap:16px; margin-top:24px; padding:16px; background:#fff; position:sticky; bottom:0; border-top:1px solid var(--gray-200); z-index:10; border-radius: 0 0 8px 8px;">
                <span style="color:var(--gray-500); font-size:14px;">请仔细阅读以上信息，确认无误后点击系统开始创建相关信息</span>
                <button class="btn-default" onclick="navigateTo('copyright-page')">取消</button>
                <button class="btn-primary" onclick="alert('版权导入成功！'); navigateTo('copyright-page');">确认创建</button>
            </div>
        `
    },
    'copyright-page': {
        title: '版权管理',
        content: `
            <div class="filter-bar copyright-filter-bar">
                <div class="copyright-filter-fields">
                    <div class="filter-item"><label>订单名称</label><input type="text" placeholder="请输入订单名称"></div>
                    <div class="filter-item"><label>订单编号</label><input type="text" placeholder="请输入订单编号"></div>
                    <div class="filter-item"><label>批次名称</label><input type="text" placeholder="请输入批次名称"></div>
                    <div class="filter-item"><label>批次编号</label><input type="text" placeholder="请输入批次编号"></div>
                    <div class="filter-item"><label>交付编号</label><input type="text" placeholder="请输入交付编号"></div>
                    <div class="filter-item"><label>歌名</label><input type="text" placeholder="请输入歌名"></div>
                    <div class="filter-item"><label>状态</label><select><option>请选择状态</option><option>未维护</option><option>已维护</option></select></div>
                </div>
                <div class="filter-actions copyright-filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
            </div>
            </div>
            <div class="action-bar" style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="position:relative;">
                        <button class="btn-primary" onclick="toggleCopyrightImportDropdown(event)"><i class="fas fa-plus"></i> 导入版权信息 <i class="fas fa-chevron-down" style="font-size:11px;"></i></button>
                        <div id="copyrightImportDropdown" style="display:none; position:absolute; left:0; top:calc(100% + 6px); min-width:160px; background:#fff; border:1px solid var(--gray-200); border-radius:6px; box-shadow:0 8px 20px rgba(15,23,42,0.12); z-index:30; padding:6px 0;">
                            <button style="display:block; width:100%; padding:9px 14px; border:none; background:#fff; text-align:left; font-size:13px; color:var(--gray-800); cursor:pointer;" onclick="closeCopyrightImportDropdown(); alert('下载模板功能')">下载模板</button>
                            <button style="display:block; width:100%; padding:9px 14px; border:none; background:#fff; text-align:left; font-size:13px; color:var(--gray-800); cursor:pointer;" onclick="closeCopyrightImportDropdown(); openModal('modal-import-copyright')">导入版权信息</button>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="openModal('modal-import-copyright-resource')"><i class="fas fa-upload"></i> 导入版权资源</button>
                </div>
                <button class="btn-default"><i class="fas fa-download"></i> 下载</button>
            </div>
            <div class="table-container">
                <table class="data-table copyright-management-table">
                    <thead><tr><th>所属订单名</th><th>所属批次名</th><th>交付编号</th><th>交付歌名</th><th>成品编号</th><th>状态</th><th>词信息</th><th>作词人</th><th>曲信息</th><th>作曲人</th><th>制作完成时间</th><th>授权时间</th><th>授权开始时间</th><th>授权结束时间</th><th>授权期限</th><th>发行日期</th><th>上线日期</th><th>下架日期</th><th>授权地区（枚举）</th><th>发行地区（枚举）</th><th>版权情况（枚举）</th><th>在线状态（枚举）</th><th>上架平台（枚举）</th><th>端口应上线平台（枚举）</th><th>发行端口（枚举）</th><th>分成比例（字符串）</th><th>商用情况（枚举）</th><th>外显歌手（枚举）</th><th>外显词作者（枚举）</th><th>外显曲作者（枚举）</th><th>上线外显（字符串）</th><th class="sticky-right copyright-download-actions">操作</th></tr></thead>
                    <tbody>
                        <tr><td>订单 1</td><td>001</td><td>DEL202606020001</td><td>窗外</td><td>AIBeat-recuGx37YKvfkw</td><td><span class="badge badge-gray">未维护</span></td><td>这是歌词</td><td>张三</td><td>曲信息</td><td>张三</td><td>2026-05-15 11:22:23</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td class="sticky-right copyright-download-actions"><button class="btn-text" style="color:var(--primary)" onclick="openCopyrightMaintainModal(this)">版权维护</button><button class="btn-text">下载</button></td></tr>
                        <tr><td>订单 1</td><td>001</td><td>DEL202606020001</td><td>他不懂</td><td>AIBeat-recuGx37YKvfkw</td><td><span class="badge badge-gray">未维护</span></td><td>这是歌词</td><td>李四</td><td>曲信息</td><td>李四</td><td>2026-05-15 11:22:23</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td class="sticky-right copyright-download-actions"><button class="btn-text" style="color:var(--primary)" onclick="openCopyrightMaintainModal(this)">版权维护</button><button class="btn-text">下载</button></td></tr>
                        <tr><td>订单 2</td><td>002</td><td>DEL202606020002</td><td>这就是爱</td><td>AIBeat-recuGx37YKvfkw</td><td><span class="badge badge-green">已维护</span></td><td>歌词</td><td>王五</td><td>曲信息</td><td>王五</td><td>2026-05-15 11:22:23</td><td>2026-05-15 11:22:23</td><td>2026-05-15</td><td>2029-05-15</td><td>三年</td><td>2026-05-16</td><td>2026-05-17</td><td>--</td><td>中国大陆</td><td>全球</td><td>独家</td><td>在线</td><td>网易云音乐</td><td>网易云/QQ音乐</td><td>网页端</td><td>50%</td><td>可商用</td><td>张杰</td><td>王五</td><td>王五</td><td>已上线</td><td class="sticky-right copyright-download-actions"><button class="btn-text" style="color:var(--primary)" onclick="openCopyrightMaintainModal(this)">版权维护</button><button class="btn-text">下载</button></td></tr>
                        <tr><td>订单 2</td><td>002</td><td>DEL202606020002</td><td>云中的angle</td><td>AIBeat-recuGx37YKvfkw</td><td><span class="badge badge-green">已维护</span></td><td>歌词</td><td>赵六</td><td>曲信息</td><td>赵六</td><td>2026-05-15 11:22:23</td><td>2026-05-15 11:22:23</td><td>2026-05-15</td><td>2029-05-15</td><td>三年</td><td>2026-05-16</td><td>2026-05-17</td><td>--</td><td>全球</td><td>全球</td><td>非独家</td><td>在线</td><td>QQ音乐</td><td>QQ音乐</td><td>移动端</td><td>30%</td><td>可商用</td><td>张杰</td><td>赵六</td><td>赵六</td><td>上线中</td><td class="sticky-right copyright-download-actions"><button class="btn-text" style="color:var(--primary)" onclick="openCopyrightMaintainModal(this)">版权维护</button><button class="btn-text">下载</button></td></tr>
                    </tbody>
                </table>
            </div>
        `
    },
    'menu-page': { 
        title: '菜单管理', 
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>搜索</label><div class="input-with-icon" style="border:1px solid var(--gray-300); border-radius:6px; padding:2px 8px; margin-top:2px;"><i class="fas fa-search"></i><input type="text" placeholder="搜索菜单名称" style="font-size:14px; padding:4px;"></div></div>
                    <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                </div>
            </div>
            <div class="action-bar"><button class="btn-primary" onclick="openModal('modal-add-menu')"><i class="fas fa-plus"></i> 新增菜单</button></div>
            <div style="display:flex; gap:24px; align-items:flex-start;">
                <!-- 左侧菜单树 -->
                <div class="info-card" style="flex: 0 0 380px; padding: 20px;">
                    <h3 style="font-size:15px; font-weight:600; margin:0 0 16px 0;">菜单树</h3>
                    <div style="font-size:14px;" id="menu-tree">
                        <div class="menu-tree-item" onclick="openMenuEdit(1,'需求管理','菜单','/demand','')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                            <span>需求管理</span><span style="color:#2F54EB; background:#F0F5FF; padding:0 6px; border-radius:4px; font-size:12px;">菜单</span>
                        </div>
                        <div class="menu-tree-item" onclick="openMenuEdit(2,'项目管理','菜单','/projects','')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                            <span>项目管理</span><span style="color:#2F54EB; background:#F0F5FF; padding:0 6px; border-radius:4px; font-size:12px;">菜单</span>
                        </div>
                        <div class="menu-tree-item" onclick="openMenuEdit(3,'批次管理','菜单','/batch','')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                            <span>批次管理</span><span style="color:#2F54EB; background:#F0F5FF; padding:0 6px; border-radius:4px; font-size:12px;">菜单</span>
                        </div>
                        <div>
                            <div class="menu-tree-item" onclick="openMenuEdit(4,'权限用户管理','目录','','')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                                <span><i class="fas fa-chevron-down" style="font-size:10px; margin-right:8px; color:var(--gray-500)"></i>权限用户管理</span><span style="color:#722ED1; background:#F9F0FF; padding:0 6px; border-radius:4px; font-size:12px;">目录</span>
                            </div>
                            <div style="padding-left:24px;">
                                <div>
                                    <div class="menu-tree-item" onclick="openMenuEdit(5,'人员管理','菜单','/staff','staff:list')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                                        <span><i class="fas fa-chevron-right" style="font-size:10px; margin-right:8px; color:var(--gray-500)"></i>人员管理</span><span style="color:#2F54EB; background:#F0F5FF; padding:0 6px; border-radius:4px; font-size:12px;">菜单</span>
                                    </div>
                                    <div style="padding-left:24px;">
                                        <div class="menu-tree-item" onclick="openMenuEdit(6,'新增人员','按钮','','staff:add')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                                            <span>新增人员</span><span style="color:#EB2F96; background:#FFF0F6; padding:0 6px; border-radius:4px; font-size:12px;">按钮</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="menu-tree-item" onclick="openMenuEdit(7,'菜单管理','菜单','/menu','menu:list')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                                    <span>菜单管理</span><span style="color:#2F54EB; background:#F0F5FF; padding:0 6px; border-radius:4px; font-size:12px;">菜单</span>
                                </div>
                                <div class="menu-tree-item" onclick="openMenuEdit(8,'角色管理','菜单','/role','role:list')" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:4px; cursor:pointer;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                                    <span>角色管理</span><span style="color:#2F54EB; background:#F0F5FF; padding:0 6px; border-radius:4px; font-size:12px;">菜单</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 右侧编辑面板 -->
                <div class="info-card" id="menu-edit-panel" style="flex:1; padding:24px; display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h3 style="font-size:15px; font-weight:600; margin:0;">编辑菜单</h3>
                        <button style="background:none; border:none; font-size:18px; color:var(--gray-400); cursor:pointer;" onclick="document.getElementById('menu-edit-panel').style.display='none'; document.querySelectorAll('.menu-tree-item').forEach(el=>el.style.background='transparent')">&times;</button>
                    </div>
                    <div class="form-group">
                        <label>菜单ID</label>
                        <input type="text" id="edit-menu-id" disabled class="input-disabled">
                    </div>
                    <div class="form-group">
                        <label>菜单名称 <span style="color:#F5222D">*</span></label>
                        <input type="text" id="edit-menu-name" placeholder="请输入菜单名称">
                    </div>
                    <div class="form-group">
                        <label>菜单类型 <span style="color:#F5222D">*</span></label>
                        <select id="edit-menu-type"><option>菜单</option><option>目录</option><option>按钮</option></select>
                    </div>
                    <div class="form-group">
                        <label>前端路径</label>
                        <input type="text" id="edit-menu-path" placeholder="请输入前端路径">
                    </div>
                    <div class="form-group">
                        <label>路由地址</label>
                        <input type="text" id="edit-menu-route" placeholder="请输入路由地址">
                    </div>
                    <div class="form-group">
                        <label>权限编码</label>
                        <input type="text" id="edit-menu-perm" placeholder="如：menu:list、staff:add">
                    </div>
                    <div class="form-group">
                        <label>备注</label>
                        <textarea rows="3" placeholder="请输入备注信息"></textarea>
                    </div>
                    <div style="display:flex; gap:12px; justify-content:flex-end; padding-top:8px; border-top:1px solid var(--gray-200); margin-top:8px;">
                        <button class="btn-default" onclick="document.getElementById('menu-edit-panel').style.display='none'; document.querySelectorAll('.menu-tree-item').forEach(el=>el.style.background='transparent')">取消</button>
                        <button class="btn-primary">保存修改</button>
                    </div>
                </div>
            </div>
        ` 
    },
    'role-page': { 
        title: '角色管理', 
        content: `
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item"><label>搜索</label><div class="input-with-icon" style="border:1px solid var(--gray-300); border-radius:6px; padding:2px 8px; margin-top:2px;"><i class="fas fa-search"></i><input type="text" placeholder="搜索角色名称" style="font-size:14px; padding:4px;"></div></div>
                    <div class="filter-actions"><button class="btn-primary">查询</button><button class="btn-default">重置</button></div>
                </div>
            </div>
            <div class="action-bar"><button class="btn-primary" onclick="openRoleForm('add')"><i class="fas fa-plus"></i> 新增角色</button></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>角色名称</th><th>菜单权限数量</th><th>状态</th><th>创建时间</th><th>最后修改时间</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr><td>系统管理员</td><td><span style="color:#1677FF; background:#EBF5FF; padding:2px 8px; border-radius:12px; font-size:12px;">8 个</span></td><td><span class="badge badge-gray">禁用</span></td><td>2026-04-01 10:30:00</td><td>2026-04-20 15:20:00</td><td><button class="btn-text" onclick="openRoleForm('edit')">编辑</button><button class="btn-text" style="color:#1677FF" onclick="openConfirmDialog('启用确认', '启用后用户将恢复该角色权限，是否确认启用？', '确认启用')">启用</button></td></tr>
                        <tr><td>项目经理</td><td><span style="color:#1677FF; background:#EBF5FF; padding:2px 8px; border-radius:12px; font-size:12px;">2 个</span></td><td><span class="badge badge-green">启用</span></td><td>2026-04-05 09:15:00</td><td>2026-04-18 11:45:00</td><td><button class="btn-text" onclick="openRoleForm('edit')">编辑</button><button class="btn-text danger" onclick="openConfirmDialog('确认禁用角色', '禁用后用户将无法登录系统，所有权限立即失效，是否确认禁用？', '确认', true)">禁用</button></td></tr>
                        <tr><td>普通用户</td><td><span style="color:#1677FF; background:#EBF5FF; padding:2px 8px; border-radius:12px; font-size:12px;">1 个</span></td><td><span class="badge badge-gray">禁用</span></td><td>2026-04-10 14:20:00</td><td>2026-04-15 16:30:00</td><td><button class="btn-text" onclick="openRoleForm('edit')">编辑</button><button class="btn-text" style="color:#1677FF" onclick="openConfirmDialog('启用确认', '启用后用户将恢复该角色权限，是否确认启用？', '确认启用')">启用</button></td></tr>
                    </tbody>
                </table>
            </div>
        ` 
    },
};

pages['task-processing-page'] = {
    title: '工作台 (任务处理)',
    content: `
        <div class="task-processing-layout">
            <aside class="task-processing-sidebar">
                <div class="task-processing-title">任务列表</div>
                <div class="task-processing-search">
                    <div class="task-processing-search-input">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="歌曲、批次、流水号...">
                    </div>
                    <button type="button" class="task-processing-search-btn" onclick="filterTaskProcessingSearch(this.parentElement.querySelector('input'))"><i class="fas fa-search"></i> 搜索</button>
                </div>
                <div class="task-processing-tabs">
                    <button class="active" data-status="全部" onclick="filterTaskProcessingTasks(this)">全部 12</button>
                    <button data-status="进行中" onclick="filterTaskProcessingTasks(this)">进行中 7</button>
                    <button data-status="已完成" onclick="filterTaskProcessingTasks(this)">已完成 5</button>
                </div>
                <div class="task-processing-list">
                    <div class="task-card" data-status="进行中" data-song-name="夜风吹过" data-reference-name="夜风参考" data-batch-name="25 年 4 月 300首" data-enter-time="2026-07-10 14:32:00" data-page-key="manual-composition-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>夜风吹过</strong>
                            <span class="task-node">作曲</span>
                            <span class="task-status status-running">进行中</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流1">工作流1</span><span>FLOW2026071000001</span></p>
                        <p><span class="task-batch-name">25 年 4 月 300首</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 14:32</p>
                    </div>
                    <div class="task-card" data-status="进行中" data-song-name="破晓时分" data-reference-name="破晓参考" data-batch-name="30 首草原风" data-enter-time="2026-07-10 14:40:00" data-page-key="song-review-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>破晓时分</strong>
                            <span class="task-node">曲审核</span>
                            <span class="task-status status-running">进行中</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流1">工作流1</span><span>FLOW2026071000002</span></p>
                        <p><span class="task-batch-name">30 首草原风</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 14:40</p>
                    </div>
                    <div class="task-card" data-status="进行中" data-song-name="云雀漫步" data-reference-name="云雀参考" data-batch-name="7 月 60 首国风" data-enter-time="2026-07-10 14:50:00" data-page-key="workbench-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>云雀漫步</strong>
                            <span class="task-node">作词</span>
                            <span class="task-status status-running">进行中</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流2">工作流2</span><span>FLOW2026071000003</span></p>
                        <p><span class="task-batch-name">7 月 60 首国风</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 14:50</p>
                    </div>
                    <div class="task-card" data-status="已完成" data-song-name="城市晚风" data-reference-name="城市晚风参考" data-batch-name="20 首 DJ" data-complete-time="2026-07-10 17:02:00" data-page-key="manual-composition-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>城市晚风</strong>
                            <span class="task-node">作曲</span>
                            <span class="task-status status-done">已完成</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流3">工作流3</span><span>FLOW2026071000011</span></p>
                        <p><span class="task-batch-name">20 首 DJ</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 17:02</p>
                        <p class="task-result-line"><span>处理结果：</span><strong class="task-result-failed">执行失败</strong></p>
                    </div>
                    <div class="task-card" data-status="进行中" data-song-name="山海回声" data-reference-name="山海参考" data-batch-name="20 首 DJ" data-enter-time="2026-07-10 15:08:00" data-page-key="workbench-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>山海回声</strong>
                            <span class="task-node">作词</span>
                            <span class="task-status status-running">进行中</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流3">工作流3</span><span>FLOW2026071000004</span></p>
                        <p><span class="task-batch-name">20 首 DJ</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 15:08</p>
                    </div>
                    <div class="task-card" data-status="已完成" data-song-name="落叶之歌" data-reference-name="落叶参考" data-batch-name="5 月 120 首流行" data-complete-time="2026-07-10 15:40:00" data-page-key="lyrics-review-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>落叶之歌</strong>
                            <span class="task-node">词审核</span>
                            <span class="task-status status-done">已完成</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流2">工作流2</span><span>FLOW2026071000005</span></p>
                        <p><span class="task-batch-name">5 月 120 首流行</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 15:40</p>
                        <p class="task-result-line"><span>处理结果：</span><strong class="task-result-rejected">已打回</strong></p>
                        <p class="task-result-reason" title="副歌韵脚不统一，部分歌词表达与歌曲主题不符"><span>打回原因：</span>副歌韵脚不统一，部分歌词表达与歌曲主题不符</p>
                    </div>
                    <div class="task-card" data-status="已完成" data-song-name="星河旅人" data-reference-name="星河参考" data-batch-name="6 月 100 首民谣" data-complete-time="2026-07-10 16:20:00" data-page-key="manual-composition-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>星河旅人</strong>
                            <span class="task-node">作曲</span>
                            <span class="task-status status-done">已完成</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流2">工作流2</span><span>FLOW2026071000006</span></p>
                        <p><span class="task-batch-name">6 月 100 首民谣</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 16:20</p>
                        <p class="task-result-line"><span>处理结果：</span><strong class="task-result-success">已提交</strong></p>
                    </div>
                    <div class="task-card" data-status="已完成" data-song-name="午夜霓虹" data-reference-name="午夜参考" data-batch-name="4 月 500 首草原风" data-complete-time="2026-07-10 15:55:00" data-page-key="song-review-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>午夜霓虹</strong>
                            <span class="task-node">曲审核</span>
                            <span class="task-status status-done">已完成</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流1">工作流1</span><span>FLOW2026071000007</span></p>
                        <p><span class="task-batch-name">4 月 500 首草原风</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 15:55</p>
                        <p class="task-result-line"><span>处理结果：</span><strong class="task-result-stopped">已终止</strong></p>
                        <p class="task-result-reason" title="副歌“你的恩情我忘不掉”旋律不流畅；同质化；音频有问题"><span>终止原因：</span>副歌“你的恩情我忘不掉”旋律不流畅；同质化；音频有问题</p>
                    </div>
                    <div class="task-card" data-status="已完成" data-song-name="潮汐回声" data-reference-name="潮汐参考" data-batch-name="30 首草原风" data-complete-time="2026-07-10 16:35:00" data-page-key="song-review-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>潮汐回声</strong>
                            <span class="task-node">曲审核</span>
                            <span class="task-status status-done">已完成</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流1">工作流1</span><span>FLOW2026071000009</span></p>
                        <p><span class="task-batch-name">30 首草原风</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 16:35</p>
                        <p class="task-result-line"><span>处理结果：</span><strong class="task-result-success">审核通过</strong></p>
                    </div>
                    <div class="task-card" data-status="已完成" data-song-name="月光来信" data-reference-name="月光参考" data-batch-name="5 月 120 首流行" data-complete-time="2026-07-10 16:48:00" data-page-key="lyrics-review-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>月光来信</strong>
                            <span class="task-node">词审核</span>
                            <span class="task-status status-done">已完成</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流2">工作流2</span><span>FLOW2026071000010</span></p>
                        <p><span class="task-batch-name">5 月 120 首流行</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 16:48</p>
                        <p class="task-result-line"><span>处理结果：</span><strong class="task-result-success">审核通过</strong></p>
                    </div>
                    <div class="task-card" data-status="进行中" data-song-name="遥远的地方" data-reference-name="遥远参考" data-batch-name="25 年 4 月 300首" data-enter-time="2026-07-10 15:30:00" data-page-key="lyrics-review-page" onclick="selectTaskProcessingTask(this)">
                        <div class="task-card-main">
                            <strong>遥远的地方</strong>
                            <span class="task-node">词审核</span>
                            <span class="task-status status-running">进行中</span>
                        </div>
                        <p class="task-card-workflow-line"><span class="task-workflow-name" title="工作流1">工作流1</span><span>FLOW2026071000008</span></p>
                        <p><span class="task-batch-name">25 年 4 月 300首</span>&nbsp;&nbsp;&nbsp;&nbsp;07-10 15:30</p>
                    </div>
                </div>
            </aside>
            <section class="task-processing-content" id="taskProcessingContent"></section>
        </div>
    `
};

// 页面切换逻辑
function showPage(pageId) {
    document.querySelectorAll('body > div[id$="-page"], body > div#app-shell').forEach(el => el.style.display = 'none');
    document.getElementById(pageId).style.display = 'flex';
}

function doLogin() {
    showPage('app-shell');
    // 默认进入工作台
    navigateTo('task-processing-page', document.querySelector('.nav-item[data-page="task-processing-page"]'));
}

// 导航栏与左侧菜单切换
function toggleNavGroup(el) {
    el.parentElement.classList.toggle('open');
}

function navigateTo(pageKey, navEl = null) {
    if (navEl) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        navEl.classList.add('active');
        // 如果是子菜单，展开父级
        if (navEl.classList.contains('sub')) {
            navEl.closest('.nav-group').classList.add('open');
        }
    }
    
    const pageData = pages[pageKey];
    if (pageData) {
        document.getElementById('page-title').innerText = pageData.title;
        document.getElementById('content-body').innerHTML = pageData.content;
        
        if (pageKey === 'song-review-page') {
            setTimeout(initSongReviewCoverPanel, 50);
        }
        if (pageKey === 'manual-composition-page') {
            setTimeout(initCompositionPromptSelect, 50);
        }
        if (pageKey === 'task-processing-page') {
            setTimeout(initTaskProcessingPage, 50);
        }
        if (pageKey === 'singer-library-page') {
            setTimeout(() => {
                renderSingersTable();
            }, 50);
        }
        if (pageKey === 'reference-library-page') {
            setTimeout(() => {
                initRefLibFilters();
                renderRefSongsTable();
            }, 50);
        }
        if (pageKey === 'node-types-page') {
            setTimeout(() => {
                renderNodeTypesTable();
            }, 50);
        }
        if (pageKey === 'node-configs-page') {
            setTimeout(() => {
                initNodeConfigsPage();
            }, 50);
        }
        if (pageKey === 'workflow-page') {
            setTimeout(() => {
                initWfPage();
            }, 50);
        }
        if (pageKey === 'batch-delivery-page') {
            setTimeout(() => {
                updateBatchDeliveryAuthEndDate();
                updateBatchDeliverySongSummary();
                updateBatchDeliverySelectedCount();
            }, 50);
        }
    }
}

// 弹窗逻辑
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        if (id === 'batchPlaylistImportModal') queryBatchPlaylistImport(true);
    }
}

function normalizeCopyrightValue(value) {
    const text = (value || '').trim();
    return text === '--' ? '' : text;
}

function getCopyrightRowValue(cells, index) {
    return normalizeCopyrightValue(cells?.[index]?.textContent);
}

function getCopyrightDateValue(value) {
    const match = normalizeCopyrightValue(value).match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : '';
}

function setCopyrightInputValue(id, value, isDate = false) {
    const field = document.getElementById(id);
    if (!field) return;
    field.value = isDate ? getCopyrightDateValue(value) : normalizeCopyrightValue(value);
}

function setCopyrightSelectValue(id, value) {
    const select = document.getElementById(id);
    const normalizedValue = normalizeCopyrightValue(value);
    if (!select) return;
    if (!normalizedValue) {
        select.selectedIndex = 0;
        return;
    }
    const exists = Array.from(select.options).some(option => option.value === normalizedValue || option.textContent.trim() === normalizedValue);
    if (!exists) {
        select.add(new Option(normalizedValue, normalizedValue));
    }
    select.value = normalizedValue;
}

function splitCopyrightMultiValues(value) {
    return normalizeCopyrightValue(value).split(/[、,，/]+/).map(item => item.trim()).filter(Boolean);
}

function setCopyrightMultiSelectValue(id, value) {
    const dropdown = document.getElementById(id);
    if (!dropdown) return;
    const selectedValues = splitCopyrightMultiValues(value);
    const menu = dropdown.querySelector('.copyright-multi-menu');
    const knownLabels = Array.from(menu.querySelectorAll('label')).map(label => label.textContent.trim());

    selectedValues.forEach(label => {
        if (!knownLabels.includes(label)) {
            const newLabel = document.createElement('label');
            newLabel.innerHTML = `<input type="checkbox" onchange="updateCopyrightMultiSelect(this)"> ${label}`;
            menu.appendChild(newLabel);
            knownLabels.push(label);
        }
    });

    dropdown.querySelectorAll('.copyright-multi-menu input').forEach(input => {
        input.checked = selectedValues.includes(input.parentElement.textContent.trim());
    });
    const firstCheckbox = dropdown.querySelector('.copyright-multi-menu input');
    if (firstCheckbox) updateCopyrightMultiSelect(firstCheckbox);
}

function openCopyrightMaintainModal(button) {
    const row = button?.closest('tr');
    const cells = row?.children;
    setCopyrightInputValue('copyrightSongName', getCopyrightRowValue(cells, 3));
    setCopyrightSelectValue('copyrightMaintainStatus', getCopyrightRowValue(cells, 5));
    setCopyrightSelectValue('copyrightAuthDuration', getCopyrightRowValue(cells, 14));
    setCopyrightInputValue('copyrightAuthStartDate', getCopyrightRowValue(cells, 12), true);
    setCopyrightInputValue('copyrightAuthEndDate', getCopyrightRowValue(cells, 13), true);
    setCopyrightInputValue('copyrightIssueDate', getCopyrightRowValue(cells, 15), true);
    setCopyrightInputValue('copyrightOnlineDate', getCopyrightRowValue(cells, 16), true);
    setCopyrightInputValue('copyrightOfflineDate', getCopyrightRowValue(cells, 17), true);
    setCopyrightSelectValue('copyrightAuthRegion', getCopyrightRowValue(cells, 18));
    setCopyrightSelectValue('copyrightIssueRegion', getCopyrightRowValue(cells, 19));
    setCopyrightSelectValue('copyrightSituation', getCopyrightRowValue(cells, 20));
    setCopyrightSelectValue('copyrightOnlineStatus', getCopyrightRowValue(cells, 21));
    setCopyrightMultiSelectValue('copyrightShelfPlatforms', getCopyrightRowValue(cells, 22));
    setCopyrightMultiSelectValue('copyrightPortPlatforms', getCopyrightRowValue(cells, 23));
    setCopyrightSelectValue('copyrightIssuePort', getCopyrightRowValue(cells, 24));
    setCopyrightInputValue('copyrightShareRatio', getCopyrightRowValue(cells, 25));
    setCopyrightSelectValue('copyrightCommercial', getCopyrightRowValue(cells, 26));
    setCopyrightSelectValue('copyrightDisplaySinger', getCopyrightRowValue(cells, 27));
    setCopyrightSelectValue('copyrightDisplayLyricist', getCopyrightRowValue(cells, 28));
    setCopyrightSelectValue('copyrightDisplayComposer', getCopyrightRowValue(cells, 29));
    setCopyrightInputValue('copyrightOnlineDisplay', getCopyrightRowValue(cells, 30));
    setCopyrightInputValue('copyrightSupplier', '');
    setCopyrightInputValue('copyrightRemark', '');
    openModal('modal-copyright-maintain');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

function closeClaimStyleDropdowns(exceptDropdown = null) {
    document.querySelectorAll('.claim-style-dropdown.open').forEach(dropdown => {
        if (dropdown !== exceptDropdown) dropdown.classList.remove('open');
    });
}

function toggleClaimStyleDropdown(event, trigger) {
    event.stopPropagation();
    const dropdown = trigger?.closest('.claim-style-dropdown');
    if (!dropdown) return;
    const willOpen = !dropdown.classList.contains('open');
    closeClaimStyleDropdowns(dropdown);
    dropdown.classList.toggle('open', willOpen);
}

function selectClaimStyle(button) {
    const dropdown = button?.closest('.claim-style-dropdown');
    if (!dropdown) return;
    const valueEl = dropdown.querySelector('.claim-style-value');
    if (valueEl) valueEl.innerText = button.textContent.trim();
    dropdown.classList.add('selected');
    dropdown.querySelectorAll('.claim-style-menu button.active').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    dropdown.classList.remove('open');
}

function closePlaylistStyleDropdowns(exceptDropdown = null) {
    document.querySelectorAll('.playlist-style-dropdown.open').forEach(dropdown => {
        if (dropdown !== exceptDropdown) dropdown.classList.remove('open');
    });
}

function togglePlaylistStyleDropdown(event, trigger) {
    event.stopPropagation();
    const dropdown = trigger?.closest('.playlist-style-dropdown');
    if (!dropdown) return;
    const willOpen = !dropdown.classList.contains('open');
    closePlaylistStyleDropdowns(dropdown);
    dropdown.classList.toggle('open', willOpen);
}

function updatePlaylistImportStyles(dropdown) {
    const selectedButtons = Array.from(dropdown.querySelectorAll('.playlist-style-menu button.active'));
    const selectedValues = selectedButtons.map(button => button.textContent.trim());
    const tagsWrap = dropdown.querySelector('.playlist-style-tags');
    const hiddenInputId = dropdown.getAttribute('data-target-input') || 'inputImportTags';
    const hiddenInput = document.getElementById(hiddenInputId);
    if (hiddenInput) hiddenInput.value = selectedValues.join(',');
    if (!tagsWrap) return;
    if (!selectedValues.length) {
        tagsWrap.innerHTML = '<span class="playlist-style-placeholder">请选择风格</span>';
        return;
    }
    tagsWrap.innerHTML = selectedValues.map(value => `<span class="playlist-style-tag" onclick="removePlaylistImportStyle(event, this, '${value}')">${value} ×</span>`).join('');
}

function togglePlaylistImportStyle(button) {
    const dropdown = button?.closest('.playlist-style-dropdown');
    if (!dropdown) return;
    button.classList.toggle('active');
    updatePlaylistImportStyles(dropdown);
    dropdown.classList.remove('open');
}

function removePlaylistImportStyle(event, tag, value) {
    event.stopPropagation();
    const dropdown = tag?.closest('.playlist-style-dropdown');
    if (!dropdown) return;
    const button = Array.from(dropdown.querySelectorAll('.playlist-style-menu button')).find(item => item.textContent.trim() === value);
    if (button) button.classList.remove('active');
    updatePlaylistImportStyles(dropdown);
}

function renderBatchPlaylistSongs(card, tbody) {
    if (!card || !tbody) return;
    if (!window.batchPlaylistDefaultSongRows) {
        window.batchPlaylistDefaultSongRows = tbody.innerHTML;
    }
    if (card.dataset.retried !== 'true') {
        tbody.innerHTML = window.batchPlaylistDefaultSongRows;
        return;
    }

    const retriedSongs = [
        { name: '遗憾清单', id: '112001', lyrics: '我们把没说完的话藏进夜里，让时间替彼此慢慢忘记。' },
        { name: '后来的我们', id: '112002', lyrics: '后来我们走向不同的街口，却还记得那年并肩吹过的风。' },
        { name: '雨天', id: '112003', lyrics: '雨落在空荡的屋檐，我一个人听回忆绕了好多圈。' },
        { name: '可惜没如果', id: '112004', lyrics: '如果当时能勇敢一点，也许故事不会停在告别以前。' },
        { name: '说散就散', id: '112005', lyrics: '说散就散的人群里，我还在寻找你转身时的背影。' },
        { name: '如果可以', id: '112006', lyrics: '如果可以回到相遇那天，我会把每一句喜欢都说完全。' }
    ];
    tbody.innerHTML = retriedSongs.map((song, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeAttr(song.name)}</td>
            <td>${escapeAttr(song.id)}</td>
            <td><div class="batch-playlist-lyrics" title="${escapeAttr(song.lyrics)}">${escapeAttr(song.lyrics)}</div></td>
        </tr>
    `).join('');
}

function selectBatchPlaylistTask(card) {
    if (!card) return;
    const modal = card.closest('#batchPlaylistImportModal');
    if (!modal) return;

    modal.querySelectorAll('.batch-playlist-task-card.active').forEach(item => item.classList.remove('active'));
    card.classList.add('active');

    const statusType = card.dataset.statusType || 'success';
    const resultId = document.getElementById('batchPlaylistResultId');
    const resultCount = document.getElementById('batchPlaylistResultCount');
    const resultStatus = document.getElementById('batchPlaylistResultStatus');
    const resultIcon = modal.querySelector('.batch-playlist-result-head .batch-playlist-task-icon');
    const songList = document.getElementById('batchPlaylistSongList');
    const songListBody = songList?.querySelector('tbody');
    const importBtn = document.getElementById('batchPlaylistImportBtn');
    const resultActions = document.getElementById('batchPlaylistResultActions');
    const isFailed = statusType === 'danger';

    if (resultId) resultId.innerText = card.dataset.id || '';
    if (resultCount) resultCount.innerText = card.dataset.count || '';
    if (resultStatus) {
        resultStatus.innerText = card.dataset.status || '';
        resultStatus.className = `batch-playlist-status ${statusType}`;
    }
    if (resultIcon) {
        resultIcon.className = `batch-playlist-task-icon ${statusType}`;
        resultIcon.innerHTML = '<i class="fas fa-check"></i>';
        resultIcon.style.display = isFailed ? 'none' : 'inline-flex';
    }
    if (!isFailed) renderBatchPlaylistSongs(card, songListBody);
    if (songList) songList.style.display = isFailed ? 'none' : '';
    if (resultActions) resultActions.style.display = isFailed ? 'none' : '';
    if (importBtn) importBtn.disabled = isFailed;
}

function setBatchPlaylistLoading(isLoading) {
    const taskLoading = document.getElementById('batchPlaylistTaskLoading');
    const resultLoading = document.getElementById('batchPlaylistResultLoading');
    const taskList = document.getElementById('batchPlaylistTaskList');
    const retryBtn = document.getElementById('batchPlaylistRetryBtn');
    const resultHead = document.getElementById('batchPlaylistResultHead');
    const songList = document.getElementById('batchPlaylistSongList');
    const resultActions = document.getElementById('batchPlaylistResultActions');

    if (taskLoading) taskLoading.style.display = isLoading ? 'flex' : 'none';
    if (resultLoading) resultLoading.style.display = isLoading ? 'flex' : 'none';
    if (taskList) taskList.style.display = isLoading ? 'none' : '';
    if (retryBtn) retryBtn.style.display = isLoading ? 'none' : '';
    if (resultHead) resultHead.style.display = isLoading ? 'none' : '';
    if (songList) songList.style.display = isLoading ? 'none' : '';
    if (resultActions) resultActions.style.display = isLoading ? 'none' : '';
}

function renderBatchPlaylistTaskCards(playlistIds) {
    const taskList = document.getElementById('batchPlaylistTaskList');
    const retryBtn = document.getElementById('batchPlaylistRetryBtn');
    if (!taskList) return [];

    const knownPlaylists = {
        '7713574197': { name: '周杰伦经典合集', count: 26, status: '已解析', statusType: 'success' },
        '8812378213': { name: '华语流行金曲100首', count: 18, status: '已解析', statusType: 'success' },
        '1128731827': { name: '伤感情歌精选', count: 0, status: '解析失败', statusType: 'danger' }
    };
    const parsedTime = formatDateTimeToSecond();

    if (!playlistIds.length) {
        taskList.innerHTML = '<div class="batch-playlist-empty">暂无歌单数据</div>';
        if (retryBtn) retryBtn.style.display = 'none';
        return [];
    }

    taskList.innerHTML = playlistIds.map((playlistId, index) => {
        const fallbackCount = 12 + (index % 4) * 3;
        const item = knownPlaylists[playlistId] || {
            name: `歌单 ${playlistId}`,
            count: fallbackCount,
            status: '已解析',
            statusType: 'success'
        };
        return `
            <div class="batch-playlist-task-card" data-id="${escapeAttr(playlistId)}" data-name="${escapeAttr(item.name)}" data-count="${item.count} 首歌曲" data-status="${item.status}" data-status-type="${item.statusType}" onclick="selectBatchPlaylistTask(this)">
                <div class="batch-playlist-task-info">
                    <strong>${escapeAttr(playlistId)}</strong>
                    <p>${item.count} 首歌曲</p>
                    <p>解析时间：${parsedTime}</p>
                </div>
                <span class="batch-playlist-status ${item.statusType}">${item.status}</span>
            </div>
        `;
    }).join('');

    const cards = Array.from(taskList.querySelectorAll('.batch-playlist-task-card'));
    if (retryBtn) retryBtn.style.display = cards.some(card => card.dataset.statusType === 'danger') ? '' : 'none';
    return cards;
}

function queryBatchPlaylistImport(forceRefresh = false) {
    const input = document.getElementById('batchPlaylistIdInput');
    const playlistIds = [...new Set(String(input?.value || '')
        .split(/[,，\s]+/)
        .map(item => item.trim())
        .filter(Boolean))];
    const queryValue = playlistIds.join(',');
    const lastQueryValue = input?.dataset.queriedValue || '';
    const hasUnimportedParsedData = Boolean(document.querySelector(
        '#batchPlaylistImportModal .batch-playlist-task-card[data-status-type="success"]'
    ));

    const parseNewData = () => {
        if (input) input.dataset.queriedValue = queryValue;
        setBatchPlaylistLoading(true);
        window.clearTimeout(window.batchPlaylistQueryTimer);
        window.batchPlaylistQueryTimer = window.setTimeout(() => {
            setBatchPlaylistLoading(false);
            const cards = renderBatchPlaylistTaskCards(playlistIds);
            const firstResolvedCard = cards.find(card => card.dataset.statusType === 'success');
            const firstCard = firstResolvedCard || cards[0];
            if (firstCard) {
                selectBatchPlaylistTask(firstCard);
            } else {
                const resultHead = document.getElementById('batchPlaylistResultHead');
                const songList = document.getElementById('batchPlaylistSongList');
                const resultActions = document.getElementById('batchPlaylistResultActions');
                if (resultHead) resultHead.style.display = 'none';
                if (songList) songList.style.display = 'none';
                if (resultActions) resultActions.style.display = 'none';
            }
        }, 1200);
    };

    if (!forceRefresh && hasUnimportedParsedData && lastQueryValue && queryValue !== lastQueryValue) {
        openConfirmDialog(
            '确认解析新数据',
            '目前有解析好的数据未导入，是否要放弃并进行新数据解析？',
            '解析新数据',
            false,
            parseNewData
        );
        return;
    }

    parseNewData();
}

function retryFailedBatchPlaylists() {
    const modal = document.getElementById('batchPlaylistImportModal');
    const failedCards = Array.from(modal?.querySelectorAll('.batch-playlist-task-card[data-status-type="danger"]') || []);
    const retryBtn = document.getElementById('batchPlaylistRetryBtn');
    if (!failedCards.length) {
        showSuccessMessage('暂无需要重试的失败歌单');
        return;
    }

    if (retryBtn) {
        retryBtn.disabled = true;
        retryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在重新拉取歌曲信息...';
    }
    failedCards.forEach(card => {
        card.classList.add('is-retrying');
        card.dataset.status = '解析中';
        const status = card.querySelector('.batch-playlist-status');
        if (status) {
            status.className = 'batch-playlist-status loading';
            status.textContent = '解析中';
        }
    });

    const activeFailedCard = failedCards.find(card => card.classList.contains('active'));
    const resultLoading = document.getElementById('batchPlaylistResultLoading');
    if (activeFailedCard && resultLoading) {
        resultLoading.style.display = 'flex';
        document.getElementById('batchPlaylistResultHead').style.display = 'none';
        document.getElementById('batchPlaylistSongList').style.display = 'none';
        document.getElementById('batchPlaylistResultActions').style.display = 'none';
    }

    window.clearTimeout(window.batchPlaylistRetryTimer);
    window.batchPlaylistRetryTimer = window.setTimeout(() => {
        const parsedTime = formatDateTimeToSecond();
        failedCards.forEach(card => {
            card.classList.remove('is-retrying');
            card.dataset.statusType = 'success';
            card.dataset.status = '已解析';
            card.dataset.count = '6 首歌曲';
            card.dataset.retried = 'true';
            const infoRows = card.querySelectorAll('.batch-playlist-task-info p');
            if (infoRows[0]) infoRows[0].textContent = '6 首歌曲';
            if (infoRows[1]) infoRows[1].textContent = `解析时间：${parsedTime}`;
            const status = card.querySelector('.batch-playlist-status');
            if (status) {
                status.className = 'batch-playlist-status success';
                status.textContent = '已解析';
            }
        });
        if (resultLoading) resultLoading.style.display = 'none';
        if (retryBtn) {
            retryBtn.disabled = false;
            retryBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 重新重试失败项';
            retryBtn.style.display = modal?.querySelector('.batch-playlist-task-card[data-status-type="danger"]') ? '' : 'none';
        }
        selectBatchPlaylistTask(failedCards[0]);
        showSuccessMessage('失败歌单歌曲信息拉取成功');
    }, 1200);
}

function initEmbeddedWorkbenchPage(pageKey) {
    if (pageKey === 'song-review-page') {
        document.querySelector('#taskProcessingContent .content-wrapper > .col-right')?.remove();
        setTimeout(initSongReviewCoverPanel, 50);
    }
    if (pageKey === 'manual-composition-page') {
        setTimeout(initCompositionPromptSelect, 50);
    }
    if (pageKey === 'workbench-page') {
        setTimeout(initTaskProcessingLyricPage, 50);
    }
}

function initTaskProcessingLyricPage() {
    const container = document.getElementById('taskProcessingContent');
    if (!container) return;

    const firstCard = container.querySelector('#step1Content .info-card');
    if (!firstCard || firstCard.querySelector('.task-change-reference-btn')) return;

    const title = firstCard.querySelector('h4');
    if (!title) return;
    title.innerHTML = '📝 作词信息';

    const header = document.createElement('div');
    header.className = 'task-lyric-info-header';
    title.parentNode.insertBefore(header, title);
    header.appendChild(title);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-default task-change-reference-btn';
    button.innerHTML = '<i class="fas fa-exchange-alt"></i> 更换对标';
    button.onclick = openTaskReferenceSongModal;
    header.appendChild(button);
}

const taskReferenceSongPageSize = 10;
let taskReferenceSongCurrentPage = 1;
let taskReferenceSongFilteredRows = [];

function openTaskReferenceSongModal() {
    const modal = document.getElementById('taskReferenceSongModal');
    if (modal) modal.style.display = 'flex';
    taskReferenceSongCurrentPage = 1;
    filterTaskReferenceSongs(document.getElementById('taskReferenceSongSearchInput')?.value || '');
}

function closeTaskReferenceSongModal() {
    const modal = document.getElementById('taskReferenceSongModal');
    if (modal) modal.style.display = 'none';
}

function filterTaskReferenceSongs(keyword = '') {
    const modal = document.getElementById('taskReferenceSongModal');
    if (!modal) return;
    const searchText = String(keyword).trim().toLowerCase();
    const rows = Array.from(modal.querySelectorAll('tbody tr'));
    taskReferenceSongFilteredRows = rows.filter(row => !searchText || row.textContent.toLowerCase().includes(searchText));
    taskReferenceSongCurrentPage = 1;

    const checked = modal.querySelector('input[name="taskReferenceSongRadio"]:checked');
    const checkedRow = checked ? checked.closest('tr') : null;
    if (!checkedRow || !taskReferenceSongFilteredRows.includes(checkedRow)) {
        if (checked) checked.checked = false;
        const firstMatchedRadio = taskReferenceSongFilteredRows[0]?.querySelector('input[type="radio"]');
        if (firstMatchedRadio) firstMatchedRadio.checked = true;
    }
    renderTaskReferenceSongPage();
}

function renderTaskReferenceSongPage() {
    const modal = document.getElementById('taskReferenceSongModal');
    if (!modal) return;

    const total = taskReferenceSongFilteredRows.length;
    const totalPages = Math.max(1, Math.ceil(total / taskReferenceSongPageSize));
    taskReferenceSongCurrentPage = Math.min(Math.max(1, taskReferenceSongCurrentPage), totalPages);
    const start = (taskReferenceSongCurrentPage - 1) * taskReferenceSongPageSize;
    const currentRows = taskReferenceSongFilteredRows.slice(start, start + taskReferenceSongPageSize);

    modal.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = currentRows.includes(row) ? '' : 'none';
    });

    const totalLabel = document.getElementById('taskReferenceSongTotal');
    if (totalLabel) totalLabel.textContent = `共 ${total} 条`;

    const prevButton = document.getElementById('taskReferenceSongPrev');
    const nextButton = document.getElementById('taskReferenceSongNext');
    if (prevButton) prevButton.disabled = taskReferenceSongCurrentPage <= 1;
    if (nextButton) nextButton.disabled = taskReferenceSongCurrentPage >= totalPages;

    const pageNumbers = document.getElementById('taskReferenceSongPageNumbers');
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        for (let page = 1; page <= totalPages; page += 1) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = page;
            button.className = page === taskReferenceSongCurrentPage ? 'active' : '';
            button.onclick = () => goToTaskReferenceSongPage(page);
            pageNumbers.appendChild(button);
        }
    }
}

function goToTaskReferenceSongPage(page) {
    taskReferenceSongCurrentPage = page;
    renderTaskReferenceSongPage();
}

function changeTaskReferenceSongPage(step) {
    taskReferenceSongCurrentPage += step;
    renderTaskReferenceSongPage();
}

function confirmTaskReferenceSong() {
    const checked = document.querySelector('#taskReferenceSongModal input[name="taskReferenceSongRadio"]:checked');
    const row = checked ? checked.closest('tr') : null;
    if (!row) {
        alert('请选择一个对标歌曲');
        return;
    }

    const songName = row.dataset.songName || '';
    const lyrics = row.dataset.songLyrics || '';
    const taskContent = document.getElementById('taskProcessingContent');
    const stepContent = taskContent ? taskContent.querySelector('#step1Content') : null;
    const titleInput = stepContent ? stepContent.querySelector('.info-card:first-child input[readonly]') : null;
    const lyricsTextarea = stepContent ? stepContent.querySelector('.info-card:first-child textarea[readonly]') : null;

    if (titleInput) titleInput.value = songName ? `《${songName}》` : '';
    if (lyricsTextarea) lyricsTextarea.value = lyrics;

    closeTaskReferenceSongModal();
    if (typeof showSuccessMessage === 'function') {
        showSuccessMessage('已更换对标歌曲');
    }
}

function renderTaskProcessingContent(pageKey = 'manual-composition-page', taskCard = null) {
    const container = document.getElementById('taskProcessingContent');
    const pageData = pages[pageKey];
    if (!container || !pageData) return;
    const taskStatus = taskCard?.dataset.status || '';
    container.dataset.currentTask = taskStatus ? `${pageKey}:${taskStatus}` : pageKey;
    delete container.dataset.readonly;
    container.innerHTML = pageData.content;
    initEmbeddedWorkbenchPage(pageKey);
    setTimeout(() => applyTaskProcessingReadonlyState(taskCard), 120);
}

function initTaskProcessingPage() {
    const wrapper = document.querySelector('.task-processing-layout');
    if (wrapper) {
        updateTaskProcessingTabCounts(wrapper);
        applyTaskProcessingFilters(wrapper, false);
    }
}

function selectTaskProcessingTask(card) {
    if (!card) return;
    document.querySelectorAll('.task-processing-list .task-card').forEach(item => item.classList.remove('active'));
    card.classList.add('active');
    renderTaskProcessingContent(card.dataset.pageKey, card);
}

function retryTaskProcessingMachineTask(event, button) {
    event?.stopPropagation();
    if (!button || button.disabled) return;

    const card = button.closest('.task-card');
    const result = card?.querySelector('.task-result-line strong');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 执行中';
    if (result) {
        result.textContent = '执行中';
        result.className = 'task-result-running';
    }

    setTimeout(() => {
        if (result) {
            result.textContent = '执行成功';
            result.className = 'task-result-success';
        }
        const statusBadge = card?.querySelector('.task-status');
        const completedAt = new Date();
        if (card) {
            card.dataset.status = '已完成';
            card.dataset.completeTime = completedAt.toISOString();
            const time = card.querySelector('.task-card-time');
            if (time) {
                const pad = value => String(value).padStart(2, '0');
                time.textContent = `${pad(completedAt.getMonth() + 1)}-${pad(completedAt.getDate())} ${pad(completedAt.getHours())}:${pad(completedAt.getMinutes())}`;
            }
        }
        if (statusBadge) {
            statusBadge.textContent = '已完成';
            statusBadge.className = 'task-status status-done';
        }
        button.remove();
        const wrapper = card?.closest('.task-processing-layout');
        if (wrapper) {
            updateTaskProcessingTabCounts(wrapper);
            applyTaskProcessingFilters(wrapper, false);
        }
        showSuccessMessage('入库节点重新执行成功');
    }, 1000);
}

function updateTaskProcessingTabCounts(wrapper) {
    const cards = Array.from(wrapper.querySelectorAll('.task-processing-list .task-card'));
    wrapper.querySelectorAll('.task-processing-tabs button').forEach(button => {
        const status = button.dataset.status || '全部';
        const count = status === '全部'
            ? cards.length
            : cards.filter(card => card.dataset.status === status).length;
        button.textContent = `${status} ${count}`;
    });
}

function completeActiveTaskProcessingTask(action = 'submit', reason = '') {
    const wrapper = document.querySelector('.task-processing-layout');
    const card = wrapper?.querySelector('.task-processing-list .task-card.active');
    if (!wrapper || !card) return false;

    const nodeName = card.querySelector('.task-node')?.textContent.trim() || '';
    let result = '处理完成';
    if (action === 'abort') {
        result = '已终止';
    } else if (action === 'reject') {
        result = '已打回';
    } else if (nodeName.includes('审核')) {
        result = '审核通过';
    } else if (nodeName.includes('作词') || nodeName.includes('作曲')) {
        result = '已提交';
    } else if (nodeName.includes('入库')) {
        result = '执行成功';
    }

    const completedAt = new Date();
    card.dataset.status = '已完成';
    card.dataset.completeTime = completedAt.toISOString();
    card.dataset.processResult = result;

    const statusBadge = card.querySelector('.task-status');
    if (statusBadge) {
        statusBadge.textContent = '已完成';
        statusBadge.className = 'task-status status-done';
    }

    let resultLine = card.querySelector('.task-result-line');
    if (!resultLine) {
        resultLine = document.createElement('p');
        resultLine.className = 'task-result-line';
        card.appendChild(resultLine);
    }
    const resultClass = result === '已终止'
        ? 'task-result-stopped'
        : result === '已打回'
            ? 'task-result-rejected'
            : 'task-result-success';
    resultLine.innerHTML = `<span>处理结果：</span><strong class="${resultClass}">${result}</strong>`;

    card.querySelector('.task-result-reason')?.remove();
    if (action === 'abort' || action === 'reject') {
        const reasonLabel = action === 'abort' ? '终止原因：' : '打回原因：';
        const reasonText = reason || (action === 'abort' ? '用户主动终止任务' : '审核未通过');
        const reasonLine = document.createElement('p');
        reasonLine.className = 'task-result-reason';
        reasonLine.title = reasonText;
        const label = document.createElement('span');
        label.textContent = reasonLabel;
        reasonLine.append(label, reasonText);
        card.appendChild(reasonLine);
    }

    let time = card.querySelector('.task-card-time');
    const timeRow = card.querySelector('.task-batch-name')?.parentElement;
    if (!time && timeRow) {
        const batchName = timeRow.querySelector('.task-batch-name');
        timeRow.textContent = '';
        if (batchName) timeRow.appendChild(batchName);
        timeRow.appendChild(document.createTextNode('    '));
        time = document.createElement('span');
        time.className = 'task-card-time';
        timeRow.appendChild(time);
    }
    if (time) {
        const pad = value => String(value).padStart(2, '0');
        time.textContent = `${pad(completedAt.getMonth() + 1)}-${pad(completedAt.getDate())} ${pad(completedAt.getHours())}:${pad(completedAt.getMinutes())}`;
    }

    updateTaskProcessingTabCounts(wrapper);
    applyTaskProcessingFilters(wrapper, false);
    showSuccessMessage(`任务处理完成，处理结果：${result}`);
    return true;
}

function filterTaskProcessingTasks(button) {
    if (!button) return;
    const wrapper = button.closest('.task-processing-layout');
    if (!wrapper) return;

    wrapper.querySelectorAll('.task-processing-tabs button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    applyTaskProcessingFilters(wrapper, false);
}

function filterTaskProcessingSearch(input) {
    const wrapper = input?.closest('.task-processing-layout');
    if (!wrapper) return;
    wrapper.dataset.taskSearchKeyword = (input.value || '').trim();
    applyTaskProcessingFilters(wrapper, false);
}

function applyTaskProcessingFilters(wrapper, autoSelect = true) {
    const status = wrapper.querySelector('.task-processing-tabs button.active')?.dataset.status || '全部';
    const keyword = (wrapper.dataset.taskSearchKeyword || '').toLowerCase();
    const cards = Array.from(wrapper.querySelectorAll('.task-processing-list .task-card'));
    updateTaskProcessingCardNames(cards);
    const sortedCards = sortTaskProcessingCards(wrapper, cards, status);
    const visibleCards = [];
    sortedCards.forEach(card => {
        const matchedStatus = status === '全部' || card.dataset.status === status;
        const matchedKeyword = !keyword || card.innerText.toLowerCase().includes(keyword);
        const shouldShow = matchedStatus && matchedKeyword;
        card.style.display = shouldShow ? '' : 'none';
        card.classList.remove('active');
        if (shouldShow) visibleCards.push(card);
    });

    if (visibleCards.length && autoSelect) {
        visibleCards[0].classList.add('active');
        renderTaskProcessingContent(visibleCards[0].dataset.pageKey, visibleCards[0]);
    } else if (visibleCards.length) {
        setTaskProcessingNullState('请选择任务');
    } else {
        setTaskProcessingNullState(keyword ? '暂无匹配任务' : '暂无对应状态的任务');
    }
}

function updateTaskProcessingCardNames(cards) {
    cards.forEach(card => {
        const title = card.querySelector('.task-card-main strong');
        if (!title) return;
        const songName = (card.dataset.songName || '').trim();
        const referenceName = (card.dataset.referenceName || '').trim();
        const displayName = songName || referenceName || '未命名歌曲';
        title.innerText = displayName;
        title.title = displayName;
    });
}

function sortTaskProcessingCards(wrapper, cards, activeStatus = '全部') {
    const list = wrapper.querySelector('.task-processing-list');
    const statusOrder = {
        '进行中': 1,
        '已完成': 2
    };
    const sortedCards = cards.slice().sort((a, b) => {
        if (activeStatus === '全部') {
            const statusDiff = (statusOrder[a.dataset.status] || 99) - (statusOrder[b.dataset.status] || 99);
            if (statusDiff !== 0) return statusDiff;
        }
        return getTaskProcessingSortTime(b) - getTaskProcessingSortTime(a);
    });

    sortedCards.forEach(card => list.appendChild(card));
    return sortedCards;
}

function getTaskProcessingSortTime(card) {
    const status = card?.dataset.status || '';
    const timeValue = status === '已完成'
        ? card.dataset.completeTime
        : card.dataset.enterTime;
    return Date.parse(timeValue || card.dataset.enterTime || card.dataset.completeTime || card.dataset.stopTime || '1970-01-01 00:00:00');
}

function setTaskProcessingNullState(message = '暂无任务') {
    document.querySelectorAll('.task-processing-list .task-card').forEach(item => item.classList.remove('active'));
    const container = document.getElementById('taskProcessingContent');
    if (container) {
        container.dataset.currentTask = 'null';
        const isSearchEmpty = message.includes('匹配');
        const emptyDescription = message === '请选择任务'
            ? ''
            : isSearchEmpty
                ? '请调整搜索关键词后重试'
                : '当前状态下暂无需要处理的任务';
        container.innerHTML = `
            <div class="task-empty-state">
                <div class="task-empty-icon"><i class="fas fa-inbox"></i></div>
                <div class="task-empty-title">${message}</div>
                ${emptyDescription ? `<div class="task-empty-desc">${emptyDescription}</div>` : ''}
            </div>
        `;
    }
}

function isTaskProcessingReadonlyStatus(status) {
    return status === '已完成';
}

function applyTaskProcessingReadonlyState(taskCard) {
    if (!taskCard || !isTaskProcessingReadonlyStatus(taskCard.dataset.status)) return;

    const container = document.getElementById('taskProcessingContent');
    if (!container) return;
    container.dataset.readonly = 'true';

    container.querySelectorAll('input, textarea, select').forEach(control => {
        control.setAttribute('disabled', 'disabled');
        control.classList.add('task-readonly-control');
    });

    container.querySelectorAll('[contenteditable="true"]').forEach(editor => {
        editor.setAttribute('contenteditable', 'false');
        editor.classList.add('task-readonly-control');
    });

    container.querySelectorAll('button').forEach(button => {
        const text = (button.innerText || '').trim();
        const onclick = button.getAttribute('onclick') || '';
        const shouldHide = /提交|终止|确认|重置|打回|审核通过|生成|重新上传|删除|添加|上传|保存/.test(text)
            || /submit|abort|suspend|confirm|delete|upload|generate|save|open.*Modal/i.test(onclick);

        if (shouldHide) {
            button.style.display = 'none';
            return;
        }

        button.disabled = true;
        button.classList.add('task-readonly-action');
    });
}

function showSuccessMessage(message) {
    document.querySelectorAll('.success-message-toast').forEach(item => item.remove());
    const toast = document.createElement('div');
    toast.className = 'success-message-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

function confirmBatchPlaylistImport() {
    const activeCard = document.querySelector('#batchPlaylistImportModal .batch-playlist-task-card.active');
    if (!activeCard || activeCard.dataset.statusType === 'danger') return;

    const taskList = document.getElementById('batchPlaylistTaskList');
    activeCard.remove();

    const nextCard = taskList?.querySelector('.batch-playlist-task-card[data-status-type="success"]')
        || taskList?.querySelector('.batch-playlist-task-card');
    if (nextCard) {
        selectBatchPlaylistTask(nextCard);
    } else {
        if (taskList) taskList.innerHTML = '<div class="batch-playlist-empty">暂无待导入歌单</div>';
        const resultHead = document.getElementById('batchPlaylistResultHead');
        const songList = document.getElementById('batchPlaylistSongList');
        const resultActions = document.getElementById('batchPlaylistResultActions');
        if (resultHead) resultHead.style.display = 'none';
        if (songList) songList.style.display = 'none';
        if (resultActions) resultActions.style.display = 'none';
    }

    showSuccessMessage('导入成功');
}

function showLyricsTooltip(target) {
    if (!target) return;
    const text = target.dataset.tooltip || target.getAttribute('title') || target.textContent.trim();
    if (!text || text === '--') return;
    target.dataset.tooltip = text;
    target.removeAttribute('title');

    document.querySelectorAll('.lyrics-tooltip-popover').forEach(item => item.remove());
    const tooltip = document.createElement('div');
    tooltip.className = 'lyrics-tooltip-popover';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = target.getBoundingClientRect();
    const gap = 8;
    const maxLeft = window.innerWidth - tooltip.offsetWidth - 16;
    const left = Math.max(16, Math.min(rect.left, maxLeft));
    let top = rect.bottom + gap;
    if (top + tooltip.offsetHeight > window.innerHeight - 16) {
        top = Math.max(16, rect.top - tooltip.offsetHeight - gap);
        tooltip.classList.add('above');
    }
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function hideLyricsTooltip() {
    document.querySelectorAll('.lyrics-tooltip-popover').forEach(item => item.remove());
}

document.addEventListener('mouseover', event => {
    const target = event.target.closest('.batch-playlist-lyrics');
    if (!target) return;
    if (target.contains(event.relatedTarget)) return;
    showLyricsTooltip(target);
});

document.addEventListener('mouseout', event => {
    const target = event.target.closest('.batch-playlist-lyrics');
    if (!target) return;
    if (target.contains(event.relatedTarget)) return;
    hideLyricsTooltip();
});
document.addEventListener('scroll', hideLyricsTooltip, true);

function toggleCopyrightImportDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('copyrightImportDropdown');
    if (!menu) return;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function closeCopyrightImportDropdown() {
    const menu = document.getElementById('copyrightImportDropdown');
    if (menu) menu.style.display = 'none';
}

function formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function calculateAuthEndDateValue(startValue, duration) {
    if (!startValue) return '';
    const durationYears = {
        '一年': 1,
        '两年': 2,
        '三年': 3,
        '五年': 5
    };
    if (duration === '永久') {
        return '9999-12-31';
    }
    if (!durationYears[duration]) return '';

    const endDate = new Date(`${startValue}T00:00:00`);
    endDate.setFullYear(endDate.getFullYear() + durationYears[duration]);
    endDate.setDate(endDate.getDate() - 1);
    return formatDateInputValue(endDate);
}

function updateCopyrightAuthEndDate() {
    const startInput = document.getElementById('copyrightAuthStartDate');
    const durationSelect = document.getElementById('copyrightAuthDuration');
    const endInput = document.getElementById('copyrightAuthEndDate');
    if (!startInput || !durationSelect || !endInput) return;

    const endValue = calculateAuthEndDateValue(startInput.value, durationSelect.value);
    if (endValue) endInput.value = endValue;
}

function updateBatchDeliveryAuthEndDate() {
    const startInput = document.getElementById('batchDeliveryAuthStartDate');
    const durationSelect = document.getElementById('batchDeliveryAuthDuration');
    const endInput = document.getElementById('batchDeliveryAuthEndDate');
    if (!startInput || !durationSelect || !endInput) return;

    const endValue = calculateAuthEndDateValue(startInput.value, durationSelect.value);
    if (endValue) endInput.value = endValue;
}

function closeCopyrightMultiDropdowns(exceptDropdown = null) {
    document.querySelectorAll('.copyright-multi-dropdown.open').forEach(dropdown => {
        if (dropdown !== exceptDropdown) dropdown.classList.remove('open');
    });
}

function toggleCopyrightMultiDropdown(event, trigger) {
    event.stopPropagation();
    const dropdown = trigger?.closest('.copyright-multi-dropdown');
    if (!dropdown) return;
    const willOpen = !dropdown.classList.contains('open');
    closeCopyrightMultiDropdowns(dropdown);
    dropdown.classList.toggle('open', willOpen);
}

function updateCopyrightMultiSelect(checkbox) {
    const dropdown = checkbox?.closest('.copyright-multi-dropdown');
    const tagsWrap = dropdown?.querySelector('.copyright-multi-tags');
    if (!dropdown || !tagsWrap) return;

    const selectedLabels = Array.from(dropdown.querySelectorAll('.copyright-multi-menu input:checked')).map(input => input.parentElement.textContent.trim());
    if (!selectedLabels.length) {
        tagsWrap.innerHTML = `<span class="copyright-multi-placeholder">${dropdown.dataset.placeholder || '请选择'}</span>`;
        return;
    }
    tagsWrap.innerHTML = selectedLabels.map(label => `<span class="copyright-tag" onclick="removeCopyrightMultiSelectTag(event, this, '${label}')">${label} <span class="copyright-tag-close">×</span></span>`).join('');
}

function removeCopyrightMultiSelectTag(event, tag, label) {
    event.stopPropagation();
    const dropdown = tag?.closest('.copyright-multi-dropdown');
    if (!dropdown) return;

    const checkbox = Array.from(dropdown.querySelectorAll('.copyright-multi-menu input')).find(input => input.parentElement.textContent.trim() === label);
    if (!checkbox) return;
    checkbox.checked = false;
    updateCopyrightMultiSelect(checkbox);
}

function updateBatchDeliverySelectedCount() {
    const checkboxes = Array.from(document.querySelectorAll('#batchDeliveryTable .batch-delivery-checkbox'));
    const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length;
    const countEl = document.getElementById('batchDeliverySelectedCount');
    const allCheckbox = document.querySelector('#batchDeliveryTable thead input[type="checkbox"]');

    if (countEl) countEl.innerText = checkedCount;
    if (allCheckbox) {
        allCheckbox.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
        allCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }
}

function updateBatchDeliverySongSummary() {
    const rows = Array.from(document.querySelectorAll('#batchDeliveryTable tbody tr'));
    const completedCount = rows.filter(row => row.textContent.includes('已完成')).length;
    const claimedCount = rows.filter(row => row.dataset.source === '领用').length;
    const madeCount = rows.filter(row => row.dataset.source === '制作').length;

    const completedEl = document.getElementById('batchDeliveryCompletedCount');
    const claimedEl = document.getElementById('batchDeliveryClaimedCount');
    const madeEl = document.getElementById('batchDeliveryMadeCount');
    if (completedEl) completedEl.innerText = completedCount;
    if (claimedEl) claimedEl.innerText = claimedCount;
    if (madeEl) madeEl.innerText = madeCount;
}

function toggleBatchDeliveryAll(checkbox) {
    document.querySelectorAll('#batchDeliveryTable .batch-delivery-checkbox').forEach(item => {
        item.checked = checkbox.checked;
    });
    updateBatchDeliverySelectedCount();
}

function handleBatchDeliverySubmit() {
    const checkboxes = Array.from(document.querySelectorAll('#batchDeliveryTable .batch-delivery-checkbox'));
    const selectedCount = checkboxes.filter(checkbox => checkbox.checked).length;
    const remainingCount = Math.max(checkboxes.length - selectedCount, 0);

    if (!checkboxes.length || remainingCount === 0) {
        navigateTo('batch-page');
        return;
    }

    const selectedEl = document.getElementById('batchDeliveryConfirmSelected');
    const remainEl = document.getElementById('batchDeliveryConfirmRemain');
    if (selectedEl) selectedEl.innerText = selectedCount;
    if (remainEl) remainEl.innerText = remainingCount;
    openModal('modal-batch-delivery-confirm');
}

function confirmBatchDeliverySubmit() {
    closeModal('modal-batch-delivery-confirm');
    navigateTo('batch-page');
}

function setSelectValue(select, value) {
    if (!select) return;
    const normalizedValue = String(value || '').trim();
    const exists = Array.from(select.options).some(option => option.value === normalizedValue || option.textContent.trim() === normalizedValue);
    if (!exists && normalizedValue) {
        const option = document.createElement('option');
        option.value = normalizedValue;
        option.textContent = normalizedValue;
        select.appendChild(option);
    }
    select.value = normalizedValue;
}

function openOrderModal(data = null) {
    const modalTitle = document.getElementById('orderModalTitle');
    if (modalTitle) modalTitle.innerText = data ? '编辑订单' : '新增订单';

    const nameInput = document.getElementById('orderFormName');
    const ownerSelect = document.getElementById('orderFormOwner');
    const customerSelect = document.getElementById('orderFormCustomer');
    const productionTypeSelect = document.getElementById('orderFormProductionType');
    const natureSelect = document.getElementById('orderFormNature');
    const cycleSelect = document.getElementById('orderFormCycle');
    const remarkInput = document.getElementById('orderFormRemark');

    if (nameInput) nameInput.value = data?.name || '';
    setSelectValue(ownerSelect, data?.owner || document.querySelector('.user-avatar')?.dataset.currentUser || '张三');
    setSelectValue(customerSelect, data?.customer || '');
    if (productionTypeSelect) {
        productionTypeSelect.value = data?.productionType || '';
        renderNodeConfigSingerMulti(productionTypeSelect.closest('.node-config-singer-select'));
    }
    setSelectValue(natureSelect, data?.nature || '');
    setSelectValue(cycleSelect, data?.cycle || '');
    if (remarkInput) remarkInput.value = '-';
    const referenceInput = document.getElementById('orderReferenceFilesInput');
    if (referenceInput) referenceInput.value = '';
    setOrderReferenceFiles(data?.referenceFiles || []);

    const overlay = document.getElementById('modal-add-order');
    const drawer = document.getElementById('orderFormDrawer');
    if (!overlay || !drawer) return;
    overlay.style.display = 'flex';
    setTimeout(() => drawer.classList.add('active'), 10);
}

function closeOrderModal() {
    const overlay = document.getElementById('modal-add-order');
    const drawer = document.getElementById('orderFormDrawer');
    if (!overlay || !drawer) return;
    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 220);
}

function openOrderModalFromRow(button) {
    const row = button?.closest('tr');
    if (!row) {
        openOrderModal();
        return;
    }

    const cells = row.querySelectorAll('td');
    const referenceFiles = (row.dataset.referenceFiles || '')
        .split('|')
        .map(item => item.trim())
        .filter(isAudioReferenceFile);
    openOrderModal({
        name: cells[1]?.textContent.trim() || '',
        owner: cells[11]?.textContent.trim() || '',
        customer: cells[2]?.textContent.trim() || '',
        productionType: cells[3]?.textContent.trim() || '',
        nature: cells[4]?.textContent.trim() || '',
        cycle: cells[5]?.textContent.trim() || '',
        remark: cells[12]?.textContent.trim() || '',
        referenceFiles
    });
}

let orderReferenceFiles = [];

function isAudioReferenceFile(fileName) {
    return /\.(mp3|wav)$/i.test(String(fileName || '').trim());
}

function getOrderReferenceFileUrl(file) {
    return file.url || 'https://www.w3schools.com/html/horse.mp3';
}

function getOrderReferenceAudioType(fileName) {
    return /\.wav$/i.test(fileName || '') ? 'audio/wav' : 'audio/mpeg';
}

function formatFileSize(size) {
    if (!size) return '0 KB';
    if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function setOrderReferenceFiles(files) {
    orderReferenceFiles = files.map(file => typeof file === 'string' ? { name: file, size: 0 } : file);
    const input = document.getElementById('orderReferenceFilesValue');
    if (input) input.value = orderReferenceFiles.map(file => file.name).join('、');
    renderOrderReferenceFiles();
}

function renderOrderReferenceFiles() {
    const list = document.getElementById('orderReferenceFilesList');
    if (!list) return;

    list.innerHTML = orderReferenceFiles.map((file, index) => {
        const fileName = escapeCompositionText(file.name);
        const fileMeta = file.size ? `（${formatFileSize(file.size)}）` : '';
        if (isAudioReferenceFile(file.name)) {
            const audioUrl = getOrderReferenceFileUrl(file);
            return `
                <div class="node-config-file-item order-reference-audio-item">
                    <div class="order-reference-file-head">
                        <span class="node-config-file-icon"><i class="fas fa-music"></i></span>
                        <span class="node-config-file-name">${fileName}${fileMeta}</span>
                        <a class="node-config-file-action" href="${audioUrl}" download="${fileName}">下载</a>
                        <button type="button" class="node-config-file-delete" onclick="removeOrderReferenceFile(${index})">删除</button>
                    </div>
                    <audio controls>
                        <source src="${audioUrl}" type="${getOrderReferenceAudioType(file.name)}">
                    </audio>
                </div>
            `;
        }

        return `
            <div class="node-config-file-item">
                <span class="node-config-file-icon"><i class="fas fa-file-alt"></i></span>
                <span class="node-config-file-name">${fileName}${fileMeta}</span>
                <button type="button" class="node-config-file-delete" onclick="removeOrderReferenceFile(${index})">删除</button>
            </div>
        `;
    }).join('');
    list.style.display = orderReferenceFiles.length ? 'flex' : 'none';
}

function handleOrderReferenceFilesUpload(input) {
    const files = Array.from(input.files || []);
    const merged = [...orderReferenceFiles, ...files.map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
    }))];
    if (merged.length > 6) {
        alert('参考资料最多上传 6 个文件');
        input.value = '';
        return;
    }
    const totalSize = merged.reduce((sum, file) => sum + (file.size || 0), 0);
    if (totalSize > 60 * 1024 * 1024) {
        alert('参考资料总大小不能超过 60M');
        input.value = '';
        return;
    }

    setOrderReferenceFiles(merged);
    input.value = '';
}

function removeOrderReferenceFile(index) {
    orderReferenceFiles.splice(index, 1);
    setOrderReferenceFiles(orderReferenceFiles);
}

function openOrderDetailDrawer() {
    const overlay = document.getElementById('orderDetailDrawerOverlay');
    const drawer = document.getElementById('orderDetailDrawer');
    const body = document.getElementById('orderDetailDrawerBody');
    if (!overlay || !drawer || !body) return;

    const temp = document.createElement('div');
    temp.innerHTML = pages['order-detail-page'].content;
    const header = temp.querySelector('.detail-header');
    if (header) header.remove();
    body.innerHTML = temp.innerHTML;

    overlay.style.display = 'flex';
    setTimeout(() => drawer.classList.add('active'), 10);
}

function closeOrderDetailDrawer() {
    const overlay = document.getElementById('orderDetailDrawerOverlay');
    const drawer = document.getElementById('orderDetailDrawer');
    if (!overlay || !drawer) return;
    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 220);
}

function openAddBatchDrawer(source = null, mode = 'add') {
    const overlay = document.getElementById('addBatchDrawerOverlay');
    const drawer = document.getElementById('addBatchDrawer');
    const body = document.getElementById('addBatchDrawerBody');
    if (!overlay || !drawer || !body) return;

    const temp = document.createElement('div');
    temp.innerHTML = pages['add-batch-page'].content;
    const header = temp.querySelector('.detail-header');
    if (header) header.remove();
    const fixedFooter = temp.querySelector('div[style*="position:fixed"]');
    if (fixedFooter) fixedFooter.remove();
    body.innerHTML = temp.innerHTML;

    const title = drawer.querySelector('.node-type-drawer-header h3');
    if (title) title.innerText = mode === 'edit' ? '编辑批次' : '新增批次';
    const workflowSelect = body.querySelector('[data-batch-workflow-select]');
    if (workflowSelect && mode === 'edit') {
        workflowSelect.disabled = true;
        workflowSelect.style.background = '#F5F5F5';
        workflowSelect.style.color = 'var(--gray-500)';
        workflowSelect.style.cursor = 'not-allowed';
    }

    overlay.style.display = 'flex';
    setTimeout(() => drawer.classList.add('active'), 10);
}

function closeAddBatchDrawer() {
    const overlay = document.getElementById('addBatchDrawerOverlay');
    const drawer = document.getElementById('addBatchDrawer');
    if (!overlay || !drawer) return;
    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 220);
}

function switchBatchDetailTab(type) {
    const makePanel = document.getElementById('batchDetailMakePanel');
    const productPanel = document.getElementById('batchDetailProductPanel');
    const makeTab = document.getElementById('batchDetailMakeTab');
    const productTab = document.getElementById('batchDetailProductTab');
    if (!makePanel || !productPanel || !makeTab || !productTab) return;

    const isMake = type === 'make';
    makePanel.style.display = isMake ? 'block' : 'none';
    productPanel.style.display = isMake ? 'none' : 'block';

    makeTab.style.color = isMake ? 'var(--primary)' : 'var(--gray-600)';
    makeTab.style.borderBottom = isMake ? '2px solid var(--primary)' : '2px solid transparent';
    makeTab.style.fontWeight = isMake ? '600' : '500';

    productTab.style.color = isMake ? 'var(--gray-600)' : 'var(--primary)';
    productTab.style.borderBottom = isMake ? '2px solid transparent' : '2px solid var(--primary)';
    productTab.style.fontWeight = isMake ? '500' : '600';
}

let selectedBatchStaffRows = [];
const batchStaffOperationLogs = [];
const batchWorkflowNodes = ['作词', '作词审核', '作曲', '作曲审核'];

function getSelectedBatchFlowRows() {
    return Array.from(document.querySelectorAll('.batch-flow-checkbox:checked')).map(checkbox => checkbox.closest('.batch-flow-row')).filter(Boolean);
}

function setBatchStaffEditableSteps(currentNodeName) {
    const currentIndex = batchWorkflowNodes.indexOf(currentNodeName);
    batchWorkflowNodes.forEach((nodeName, index) => {
        const select = document.getElementById(`batchStaffStepSelect${index}`);
        const row = select?.closest('.batch-staff-step-row');
        if (!select || !row) return;
        const editable = index >= currentIndex && currentIndex >= 0;
        select.disabled = !editable;
        select.value = '';
        select.style.background = editable ? '#fff' : '#F5F5F5';
        select.style.color = editable ? 'var(--gray-800)' : 'var(--gray-400)';
        row.style.opacity = editable ? '1' : '0.55';
    });
}

function setSingleStaffEditableSteps(currentNodeName) {
    const currentIndex = batchWorkflowNodes.indexOf(currentNodeName);
    batchWorkflowNodes.forEach((nodeName, index) => {
        const select = document.getElementById(`singleStaffStepSelect${index}`);
        const row = select?.closest('.single-staff-step-row');
        if (!select || !row) return;
        const editable = index >= currentIndex && currentIndex >= 0;
        select.disabled = !editable;
        select.value = '';
        select.style.background = editable ? '#fff' : '#F5F5F5';
        select.style.color = editable ? 'var(--gray-800)' : 'var(--gray-400)';
        row.style.opacity = editable ? '1' : '0.55';
    });
}

function openSingleStaffMaintenance(button) {
    const row = button?.closest('.batch-flow-row');
    const nodeName = row?.dataset.node || '';
    setSingleStaffEditableSteps(nodeName);
    openModal('modal-staff-maintenance');
}

function handleBatchEditStaffClick() {
    const selectedRows = getSelectedBatchFlowRows();
    if (!selectedRows.length) {
        alert('请先选择需要维护人员的制作任务。');
        return;
    }

    const invalidRows = selectedRows.filter(row => {
        const status = row.dataset.status || '';
        const node = row.dataset.node || '';
        return status === '已终止' || !node || node === '-';
    });
    const nodeNames = Array.from(new Set(selectedRows.map(row => row.dataset.node || '')));
    if (invalidRows.length || nodeNames.length !== 1) {
        alert('请选择状态为非终止、且当前运行至同一节点的流水数据进行操作。');
        return;
    }

    selectedBatchStaffRows = selectedRows;
    const flowIds = selectedRows.map(row => row.children[1]?.innerText || '-');
    const owners = Array.from(new Set(selectedRows.map(row => row.querySelector('.batch-flow-owner-cell')?.innerText || '-')));
    const nodeName = nodeNames[0];

    document.getElementById('batchStaffSelectedCount').innerText = selectedRows.length;
    document.getElementById('batchStaffNodeName').innerText = nodeName;
    document.getElementById('batchStaffFlowIds').innerText = flowIds.join('、');
    document.getElementById('batchStaffOriginalOwners').innerText = owners.join('、');
    setBatchStaffEditableSteps(nodeName);
    openModal('modal-batch-edit-staff');
}

function submitBatchStaffEdit() {
    const selectedOwners = batchWorkflowNodes.map((nodeName, index) => {
        const select = document.getElementById(`batchStaffStepSelect${index}`);
        return {
            nodeName,
            owner: select && !select.disabled ? select.value : ''
        };
    }).filter(item => item.owner);
    if (!selectedOwners.length) {
        alert('请至少选择一个需要维护节点的新执行人。');
        return;
    }
    const operator = '当前用户';
    const operationTime = new Date().toLocaleString('zh-CN', { hour12: false });
    selectedBatchStaffRows.forEach(row => {
        const flowId = row.children[1]?.innerText || '-';
        const nodeName = row.dataset.node || '-';
        const ownerCell = row.querySelector('.batch-flow-owner-cell');
        const oldOwner = ownerCell?.innerText || '-';
        const currentNodeOwner = selectedOwners.find(item => item.nodeName === nodeName)?.owner;
        if (ownerCell && currentNodeOwner) ownerCell.innerText = currentNodeOwner;
        if (row.dataset.status === '待分配') {
            row.dataset.status = '进行中';
            const statusCell = row.querySelector('.batch-flow-status-cell');
            if (statusCell) statusCell.innerHTML = '<span class="badge" style="border:1px solid #1677FF; color:#1677FF; background:transparent;">进行中</span>';
        }
        selectedOwners.forEach(item => {
            batchStaffOperationLogs.push({
                operationType: '批量维护人员',
                flowId,
                nodeName: item.nodeName,
                operator,
                operationTime,
                oldOwner: item.nodeName === nodeName ? oldOwner : '-',
                newOwner: item.owner
            });
        });
    });
    document.querySelectorAll('.batch-flow-checkbox:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    closeModal('modal-batch-edit-staff');
    alert(`修改成功，已记录操作人、操作时间、原执行人及新执行人。`);
}

function filterBatchClaimSongs() {
    const songName = (document.getElementById('batchClaimSongNameFilter')?.value || '').trim().toLowerCase();
    const songCode = (document.getElementById('batchClaimSongCodeFilter')?.value || '').trim().toLowerCase();
    const singer = (document.getElementById('batchClaimSingerFilter')?.value || '').trim().toLowerCase();
    document.querySelectorAll('.batch-claim-song-row').forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowCode = (cells[0]?.innerText || '').toLowerCase();
        const rowName = (cells[1]?.innerText || '').toLowerCase();
        const rowSinger = (cells[3]?.innerText || '').toLowerCase();
        const matched = (!songName || rowName.includes(songName)) &&
            (!songCode || rowCode.includes(songCode)) &&
            (!singer || rowSinger.includes(singer));
        row.style.display = matched ? '' : 'none';
    });
}

function resetBatchClaimSongs() {
    ['batchClaimSongNameFilter', 'batchClaimSongCodeFilter', 'batchClaimSingerFilter'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    document.querySelectorAll('.batch-claim-song-row').forEach(row => {
        row.style.display = '';
    });
}

function switchOrderSongTab(type) {
    const flowTable = document.getElementById('orderSongFlowTable');
    const productTable = document.getElementById('orderSongProductTable');
    const flowTab = document.getElementById('orderSongFlowTab');
    const productTab = document.getElementById('orderSongProductTab');
    if (!flowTable || !productTable || !flowTab || !productTab) return;

    const isFlow = type === 'flow';
    flowTable.style.display = isFlow ? 'block' : 'none';
    productTable.style.display = isFlow ? 'none' : 'block';
    flowTab.style.color = isFlow ? 'var(--primary)' : 'var(--gray-600)';
    flowTab.style.borderBottom = isFlow ? '2px solid var(--primary)' : '2px solid transparent';
    flowTab.style.fontWeight = isFlow ? '600' : '500';
    productTab.style.color = isFlow ? 'var(--gray-600)' : 'var(--primary)';
    productTab.style.borderBottom = isFlow ? '2px solid transparent' : '2px solid var(--primary)';
    productTab.style.fontWeight = isFlow ? '500' : '600';
    filterOrderSongListByBatch();
}

function filterOrderSongListByBatch() {
    const batchValue = document.getElementById('orderSongBatchFilter')?.value || '';
    document.querySelectorAll('.order-song-table-panel tbody tr').forEach(row => {
        row.style.display = !batchValue || row.dataset.batch === batchValue ? '' : 'none';
    });
}

const existingCustomerNames = ['番茄畅听', '客户六'];
let customerCodeCounters = { OP: 1, MP: 1 };

function openCustomerDrawer() {
    const overlay = document.getElementById('modal-add-customer');
    const drawer = document.getElementById('customerDrawer');
    if (!overlay || !drawer) return;

    resetCustomerDrawerForm();
    overlay.style.display = 'flex';
    setTimeout(() => drawer.classList.add('active'), 10);
}

function closeCustomerDrawer() {
    const overlay = document.getElementById('modal-add-customer');
    const drawer = document.getElementById('customerDrawer');
    if (!overlay || !drawer) return;

    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 220);
}

function resetCustomerDrawerForm() {
    const fields = [
        'customerNameInput',
        'customerCompanyInput',
        'customerTypeSelect',
        'customerBusinessLineInput',
        'customerOtherDemandInput',
        'customerProgressRemark',
        'customerCommunicationRecord'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    document.querySelectorAll('#customerDemandGroup input[type="checkbox"]').forEach(box => {
        box.checked = false;
    });

    const otherWrap = document.getElementById('customerOtherDemandWrap');
    if (otherWrap) otherWrap.style.display = 'none';

    const contact = document.getElementById('add-customer-contact');
    if (contact) contact.value = '张三';

    const status = document.getElementById('customerProgressStatus');
    if (status) status.value = '初步接触';

    const priority = document.getElementById('customerPrioritySelect');
    if (priority) priority.value = 'P2';

    const hint = document.getElementById('customerNameHint');
    if (hint) {
        hint.textContent = '';
        hint.className = 'field-hint';
    }
}

function validateCustomerName() {
    const input = document.getElementById('customerNameInput');
    const hint = document.getElementById('customerNameHint');
    if (!input || !hint) return true;

    const name = input.value.trim();
    hint.className = 'field-hint';
    if (!name) {
        hint.textContent = '';
        return false;
    }

    if (existingCustomerNames.includes(name)) {
        hint.textContent = '该客户名称已存在，请确认后再录入';
        hint.classList.add('error');
        return false;
    }

    hint.textContent = '客户名称可用';
    hint.classList.add('success');
    return true;
}

function toggleCustomerOtherDemand(checkbox) {
    const wrap = document.getElementById('customerOtherDemandWrap');
    if (wrap) wrap.style.display = checkbox.checked ? 'block' : 'none';
}

function handleCustomerProgressChange() {
    const status = document.getElementById('customerProgressStatus')?.value;
    const priority = document.getElementById('customerPrioritySelect');
    if (status === '长期合作中' && priority) {
        priority.value = 'P1';
    }
}

function submitCustomerDrawer() {
    const requiredFields = [
        ['customerNameInput', '请填写客户名称'],
        ['customerCompanyInput', '请填写公司名称'],
        ['customerTypeSelect', '请选择客户类型'],
        ['customerBusinessLineInput', '请填写客户业务线'],
        ['add-customer-contact', '请选择对接人'],
        ['customerProgressStatus', '请选择推进状态'],
        ['customerPrioritySelect', '请选择推进优先级']
    ];

    for (const [id, message] of requiredFields) {
        const el = document.getElementById(id);
        if (!el || !String(el.value || '').trim()) {
            alert(message);
            if (el) el.focus();
            return;
        }
    }

    if (!validateCustomerName()) {
        document.getElementById('customerNameInput')?.focus();
        return;
    }

    const demands = Array.from(document.querySelectorAll('#customerDemandGroup input[type="checkbox"]:checked')).map(item => item.value);
    if (demands.length === 0) {
        alert('请选择制作需求');
        return;
    }

    if (demands.includes('其他') && !document.getElementById('customerOtherDemandInput')?.value.trim()) {
        alert('请补充其他制作需求');
        document.getElementById('customerOtherDemandInput')?.focus();
        return;
    }

    const type = document.getElementById('customerTypeSelect').value;
    const prefix = type === '平台方' ? 'OP' : 'MP';
    customerCodeCounters[prefix] = (customerCodeCounters[prefix] || 0) + 1;
    existingCustomerNames.push(document.getElementById('customerNameInput').value.trim());
    closeCustomerDrawer();
}

function openConfirmDialog(title = '确认操作', message = '确定要执行此操作吗？', btnText = '确认', isDanger = false, callback = null) {
    document.getElementById('confirm-title').innerText = title;
    document.getElementById('confirm-message').innerText = message;
    const btn = document.getElementById('confirm-btn');
    btn.innerText = btnText;
    if (isDanger) {
        btn.style.background = '#F5222D';
        btn.style.borderColor = '#F5222D';
    } else {
        btn.style.background = 'var(--primary)';
        btn.style.borderColor = 'var(--primary)';
    }
    btn.onclick = function() {
        closeModal('modal-confirm');
        if (callback) {
            callback();
        }
    };
    openModal('modal-confirm');
}

function openMenuEdit(id, name, type, path, perm) {
    // 高亮选中项
    document.querySelectorAll('.menu-tree-item').forEach(el => el.style.background = 'transparent');
    event.currentTarget.style.background = '#EBF5FF';
    // 回显数据
    document.getElementById('edit-menu-id').value = id;
    document.getElementById('edit-menu-name').value = name;
    document.getElementById('edit-menu-path').value = path || '';
    document.getElementById('edit-menu-perm').value = perm || '';
    document.getElementById('edit-menu-route').value = path ? path.replace('/', '') + '-route' : '';
    const typeSelect = document.getElementById('edit-menu-type');
    for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].text === type) { typeSelect.selectedIndex = i; break; }
    }
    // 显示面板
    document.getElementById('menu-edit-panel').style.display = 'block';
}
function togglePermGroup(groupId, event) {
    // 阻止复选框点击触发折叠
    if (event.target.tagName.toLowerCase() === 'input') return;
    
    const groupDiv = document.getElementById(groupId);
    const iconId = groupId.replace('group', 'icon');
    const icon = document.getElementById(iconId);
    
    if (groupDiv) {
        if (groupDiv.style.display === 'none') {
            groupDiv.style.display = 'block';
            if (icon) {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            }
        } else {
            groupDiv.style.display = 'none';
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            }
        }
    }
}

function toggleGroupCheck(checkbox, groupId) {
    const groupDiv = document.getElementById(groupId);
    if (groupDiv) {
        // 级联选择所有子项
        const children = groupDiv.querySelectorAll('input[type="checkbox"]');
        children.forEach(child => {
            child.checked = checkbox.checked;
            child.indeterminate = false;
        });
    }
    
    // 向上更新父节点状态
    updateParentCheckStatus(checkbox);
    updatePermCount();
}

function updateParentCheckStatus(checkbox) {
    const parentId = checkbox.getAttribute('data-parent');
    if (!parentId) return;
    
    const parentGroupDiv = document.getElementById(parentId);
    if (!parentGroupDiv) return;
    
    const parentCheckbox = document.querySelector(`input[data-group="${parentId}"]`);
    if (!parentCheckbox) return;
    
    // 查找该组下的直接子节点
    const siblings = Array.from(parentGroupDiv.querySelectorAll(`input[type="checkbox"][data-parent="${parentId}"]`));
    
    // 还有一种情况：如果父节点下有子节点是一个组，我们需要收集这些组的 checkbox
    // 简单起见，我们收集 parentGroupDiv 下所有直接属于它的 checkbox
    
    let allChecked = siblings.length > 0;
    let someChecked = false;
    
    siblings.forEach(sib => {
        if (sib.checked || sib.indeterminate) {
            someChecked = true;
        }
        if (!sib.checked) {
            allChecked = false;
        }
    });
    
    parentCheckbox.checked = allChecked;
    parentCheckbox.indeterminate = someChecked && !allChecked;
    
    // 递归向上
    updateParentCheckStatus(parentCheckbox);
}

function updatePermCount() {
    const e = window.event;
    if (e && e.target && e.target.type === 'checkbox') {
        updateParentCheckStatus(e.target);
    }
    
    const allChecked = document.querySelectorAll('#role-perm-tree input[type="checkbox"]:checked');
    document.getElementById('role-auth-count').innerText = `已选择 ${allChecked.length} 个菜单权限`;
}


function openRoleForm(mode) {
    const title = document.getElementById('role-form-title');
    const btn = document.getElementById('role-form-btn');
    const input = document.getElementById('role-name-input');
    const chks = document.querySelectorAll('.role-chk');
    const count = document.getElementById('role-auth-count');
    
    if (mode === 'add') {
        title.innerText = '新增角色';
        btn.innerText = '确认提交';
        input.value = '';
        chks.forEach(chk => chk.checked = false);
        count.innerText = '已选择 0 个菜单权限';
    } else {
        title.innerText = '编辑角色';
        btn.innerText = '保存修改';
        input.value = '系统管理员';
        chks.forEach(chk => chk.checked = true);
        count.innerText = `已选择 ${chks.length} 个菜单权限`;
    }
    openModal('modal-role-form');
}

// 密码显示/隐藏切换
document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
    document.addEventListener('click', () => {
        closeCopyrightMultiDropdowns();
        closeClaimStyleDropdowns();
        closePlaylistStyleDropdowns();
    });
});

// 交付批次直接完成
function deliverBatch(btn) {
    const row = btn.closest('tr');
    const badge = row.querySelector('.badge');
    badge.className = 'badge badge-green';
    badge.innerText = '已交付';
    btn.remove();
    alert('交付成功！');
}

let pendingBatchFinishRow = null;

function finishBatch(btn) {
    const row = btn?.closest('tr');
    const statusBadge = row?.querySelector('td:nth-child(7) .badge');
    const currentStatus = statusBadge?.textContent.trim() || '';
    const allowedStatuses = ['待生产', '生产中', '待交付', '部分交付'];
    if (!row || !statusBadge || !allowedStatuses.includes(currentStatus)) return;

    pendingBatchFinishRow = row;
    openModal('modal-batch-finish-confirm');
}

function closeBatchFinishModal() {
    pendingBatchFinishRow = null;
    closeModal('modal-batch-finish-confirm');
}

function confirmFinishBatch() {
    const row = pendingBatchFinishRow;
    if (!row) return;

    const statusBadge = row.querySelector('td:nth-child(7) .badge');
    statusBadge.className = 'badge badge-gray';
    statusBadge.textContent = '已完结';
    const actionCell = row.cells[row.cells.length - 1];
    actionCell.innerHTML = '<button class="btn-text" onclick="navigateTo(\'batch-detail-page\')">详情</button>';
    pendingBatchFinishRow = null;
    closeModal('modal-batch-finish-confirm');
    showSuccessMessage('批次已完结');
}


// ==================== 工作台 (人工写词) 业务逻辑 ====================
function copyField(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅';
        btn.style.color = 'green';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
        }, 2000);
    });
}

function validateInput() {
    const titleInput = document.getElementById('newTitle');
    const lyricsInput = document.getElementById('newLyrics');
    const submitBtn = document.getElementById('submitBtn');
    
    if (titleInput && lyricsInput && submitBtn) {
        const title = titleInput.value.trim();
        const lyrics = lyricsInput.value.trim();
        submitBtn.disabled = !(title && lyrics);
    }
}

function submitTask() {
    const title = document.getElementById('newTitle').value.trim();
    const lyrics = document.getElementById('newLyrics').value.trim();
    
    if (!title || !lyrics) {
        alert('错误 (CONTENT_EMPTY): 歌名与歌词均不能为空！');
        return;
    }
    
    openModal('submitModalOverlay');
}

function closeSubmitModal() {
    closeModal('submitModalOverlay');
    document.getElementById('submitRemark').value = '';
}

function confirmSubmit() {
    const remark = document.getElementById('submitRemark').value.trim();
    closeModal('submitModalOverlay');
    
    const container = document.querySelector('#workbench-page .content-wrapper');
    if (container) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                <div style="font-size: 48px; color: var(--success);">✓</div>
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">页面已关闭</h3>
                <p style="color: var(--gray-600); font-size: 14px;">已提交结果，交由工作流处理中...</p>
                ${remark ? `<p style="background: var(--gray-50); padding: 10px 16px; border-radius: 6px; border: 1px solid var(--gray-200); font-size: 13px; color: var(--gray-700);">附带备注: ${remark}</p>` : ''}
            </div>
        `;
    }
    completeActiveTaskProcessingTask('submit');
}

function showAbortModal() {
    openModal('abortModalOverlay');
}

function closeAbortModal() {
    closeModal('abortModalOverlay');
    document.getElementById('abortReason').value = '';
    const checkedRadio = document.querySelector('input[name="abortReasonType"]:checked');
    if (checkedRadio) checkedRadio.checked = false;
    document.getElementById('otherReasonContainer').style.display = 'none';
}

function confirmAbort() {
    const selectedRadio = document.querySelector('input[name="abortReasonType"]:checked');
    let reason = '';
    
    if (selectedRadio) {
        if (selectedRadio.value === 'style') {
            reason = '对标词风格不对';
        } else if (selectedRadio.value === 'other') {
            const textReason = document.getElementById('abortReason').value.trim();
            reason = '其他: ' + (textReason || '(未填写详细原因)');
        }
    } else {
        reason = '(未选择具体原因)';
    }

    closeModal('abortModalOverlay');
    
    const container = document.querySelector('#workbench-page .content-wrapper');
    if (container) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                <div style="font-size: 48px; color: var(--danger);">✕</div>
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">任务已终止</h3>
                <p style="background: #FFF0F0; color: var(--danger); padding: 10px 16px; border-radius: 6px; font-size: 13px;">终止原因: ${reason}</p>
            </div>
        `;
    }
    completeActiveTaskProcessingTask('abort', reason);
}

function switchStep(step) {
    const step1Content = document.getElementById('step1Content');
    const step2Content = document.getElementById('step2Content');
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    
    if (step1Content && step2Content && tab1 && tab2) {
        if (step === 1) {
            step1Content.style.display = 'flex';
            step2Content.style.display = 'none';
            
            tab1.style.color = 'var(--primary)';
            tab1.style.borderBottom = '2px solid var(--primary)';
            tab1.style.fontWeight = '600';
            
            tab2.style.color = 'var(--gray-600)';
            tab2.style.borderBottom = 'none';
            tab2.style.fontWeight = '500';
        } else {
            step1Content.style.display = 'none';
            step2Content.style.display = 'flex';
            
            tab2.style.color = 'var(--primary)';
            tab2.style.borderBottom = '2px solid var(--primary)';
            tab2.style.fontWeight = '600';
            
            tab1.style.color = 'var(--gray-600)';
            tab1.style.borderBottom = 'none';
            tab1.style.fontWeight = '500';
        }
    }
}

function simulateGenerate() {
    const btn = document.querySelector('button[onclick="simulateGenerate()"]');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ 正在请求 AI 生成...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        const generatedText1 = `[Verse]\n风吹过夏天的街道\n带来你微笑的味道\n微风和晚霞在奔跑\n时间在这里停靠\n\n[Chorus]\n就算世界都在改变\n我依然会陪在你身边`;
        const generatedText2 = `[Verse]\n那年夏天的蝉鸣\n一直回荡在梦里\n你转身离去的背影\n我还在这里等你\n\n[Chorus]\n时光虽然已经遥远\n记忆依然如此鲜艳`;
        
        // Show result on step 1
        const resultCard = document.getElementById('generatedResultCard');
        if (resultCard) {
            document.getElementById('generatedLyrics1').value = generatedText1;
            document.getElementById('copyGeneratedBtn1').setAttribute('onclick', `copyField(this, \`${generatedText1.replace(/\n/g, '\\n')}\`)`);

            document.getElementById('generatedLyrics2').value = generatedText2;
            document.getElementById('copyGeneratedBtn2').setAttribute('onclick', `copyField(this, \`${generatedText2.replace(/\n/g, '\\n')}\`)`);
            
            resultCard.style.display = 'block';

            // Also pre-fill the step 2 textarea for convenience
            const textareaEdit = document.getElementById('newLyrics');
            if (textareaEdit) {
                textareaEdit.value = generatedText1;
            }
            validateInput();
            
            // Scroll to the bottom of step 1 to see the result
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1500);
}

// ==================== 工作台 (歌词审核) 业务逻辑 ====================
function handleRatingChange() {
    const ratingSelect = document.getElementById('ratingSelect');
    const remarkContainer = document.getElementById('remarkContainer');
    const remarkLabel = document.getElementById('remarkLabel');
    const remarkInput = document.getElementById('remarkInput');
    const submitBtn = document.getElementById('submitReviewBtn');

    if (!ratingSelect || !remarkContainer || !remarkLabel || !remarkInput || !submitBtn) return;

    const rating = ratingSelect.value;
    if (!rating) return;

    remarkContainer.style.display = 'block';
    submitBtn.style.display = 'inline-flex';

    if (rating === 'B' || rating === 'C') {
        remarkLabel.innerHTML = '打回原因 <span style="color: red;">*</span>';
        remarkInput.placeholder = '请填写明确的修改建议，必须填写才可提交。';
        submitBtn.className = 'btn-primary';
        submitBtn.style.backgroundColor = 'var(--danger)';
        submitBtn.style.borderColor = 'var(--danger)';
        submitBtn.textContent = '打回重做';
        submitBtn.disabled = remarkInput.value.trim() === '';
    } else {
        remarkLabel.innerHTML = '综合评语 <span style="color: var(--gray-500); font-weight: normal;">(选填)</span>';
        remarkInput.placeholder = '可选填：整体评价或少量瑕疵记录...';
        submitBtn.className = 'btn-primary';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.borderColor = '';
        submitBtn.textContent = '提交任务';
        submitBtn.disabled = false;
    }
}

function validateReviewInput() {
    const ratingSelect = document.getElementById('ratingSelect');
    const remarkInput = document.getElementById('remarkInput');
    const submitBtn = document.getElementById('submitReviewBtn');

    if (!ratingSelect || !remarkInput || !submitBtn) return;

    const rating = ratingSelect.value;
    if (rating === 'B' || rating === 'C') {
        submitBtn.disabled = remarkInput.value.trim() === '';
    }
}

function submitReview() {
    const ratingSelect = document.getElementById('ratingSelect');
    if (!ratingSelect) return;

    const rating = ratingSelect.value;
    const remark = document.getElementById('remarkInput').value.trim();

    if (rating === 'B' || rating === 'C') {
        if (confirm('是否确认打回歌词和歌名？\n\n点击「打回」将把任务退回上一步。')) {
            const container = document.querySelector('#lyrics-review-page .content-wrapper');
            if (container) {
                container.innerHTML = `
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                        <div style="font-size: 48px; color: var(--danger);">✕</div>
                        <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">页面已关闭</h3>
                        <p style="color: var(--gray-600); font-size: 14px;">工作流已打回至上一步...</p>
                        ${remark ? `<p style="background: #FFF0F0; padding: 10px 16px; border-radius: 6px; border: 1px solid var(--danger); font-size: 13px; color: var(--danger);">打回原因: ${remark}</p>` : ''}
                    </div>
                `;
            }
            completeActiveTaskProcessingTask('reject', remark);
        }
    } else {
        if (confirm('是否确认提交评级结果，如果确认，评级结果将不可修改。')) {
            const container = document.querySelector('#lyrics-review-page .content-wrapper');
            if (container) {
                container.innerHTML = `
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                        <div style="font-size: 48px; color: var(--success);">✓</div>
                        <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">页面已关闭</h3>
                        <p style="color: var(--gray-600); font-size: 14px;">交由工作流处理中...</p>
                        <p style="background: var(--gray-50); padding: 10px 16px; border-radius: 6px; border: 1px solid var(--gray-200); font-size: 13px; color: var(--gray-700);">审核结果: <strong>${rating}</strong> ${remark ? `(${remark})` : ''}</p>
                    </div>
                `;
            }
            completeActiveTaskProcessingTask('submit', remark);
        }
    }
}

// ==================== 工作台 (跑曲) 业务逻辑 ====================
function switchWorkbenchTask(moduleName, direction) {
    alert(`${moduleName}已切换至${direction}`);
}

function switchCompositionStep(step) {
    const step1Content = document.getElementById('compStep1Content');
    const step2Content = document.getElementById('compStep2Content');
    const tab1 = document.getElementById('compTab1');
    const tab2 = document.getElementById('compTab2');

    if (step1Content && step2Content && tab1 && tab2) {
        if (step === 1) {
            step1Content.style.display = 'flex';
            step2Content.style.display = 'none';

            tab1.style.color = 'var(--primary)';
            tab1.style.borderBottom = '2px solid var(--primary)';
            tab1.style.fontWeight = '600';

            tab2.style.color = 'var(--gray-600)';
            tab2.style.borderBottom = 'none';
            tab2.style.fontWeight = '500';
        } else {
            step1Content.style.display = 'none';
            step2Content.style.display = 'flex';

            tab2.style.color = 'var(--primary)';
            tab2.style.borderBottom = '2px solid var(--primary)';
            tab2.style.fontWeight = '600';

            tab1.style.color = 'var(--gray-600)';
            tab1.style.borderBottom = 'none';
            tab1.style.fontWeight = '500';
        }
    }
}

const compositionBusinessInfoMap = {
    prompt: [
        ['风格', '年轻ins1'],
        ['生成方式', 'prompt'],
        ['歌手', '欣瑶-女，赵雷-男'],
        ['音色特点', '甜美清澈，高音亮'],
        ['歌词字数参考', '测试中用到的是8个字'],
        ['模型', '5.5'],
        ['提示词（style 内容）', 'young sweet pop, female vocal, soft, dreamy']
    ],
    inspo: [
        ['风格', '年轻ins1'],
        ['生成方式', 'inspo'],
        ['歌手', '欣瑶-女'],
        ['音色特点', '甜美清澈，高音亮'],
        ['歌词字数参考', '测试中用到的是8个字'],
        ['模型', '5.5'],
        ['提示词（style 内容）', 'acoustic guitar, indie folk, warm, gentle vocal texture']
    ],
    cover: [
        ['风格', '年轻ins1'],
        ['生成方式', 'cover'],
        ['歌手', '欣瑶-女'],
        ['音色特点', '甜美清澈，高音亮'],
        ['歌词字数参考', '测试中用到的是8个字'],
        ['模型', '5.5'],
        ['提示词（style 内容）', 'upbeat edm, male vocal, energetic, cover arrangement reference、upbeat edm, male vocal, energetic, cover arrangement referenceupbeat edm, male vocal, energetic, cover arrangement reference']
    ],
    sample: [
        ['风格', '年轻ins1'],
        ['生成方式', 'sample'],
        ['歌手', '欣瑶-女，赵雷-男'],
        ['音色特点', '甜美清澈，高音亮'],
        ['歌词字数参考', '测试中用到的是8个字'],
        ['模型', '5.5'],
        ['提示词（style 内容）', 'lo-fi hip hop, chill beats, relaxed sample-driven groove']
    ]
};

function getCompositionBusinessInfoValue(type, label, fallback = '') {
    const rows = compositionBusinessInfoMap[type] || [];
    const row = rows.find(([rowLabel]) => rowLabel === label);
    return row ? row[1] : fallback;
}

function getCompositionPromptOptionLabel(type) {
    const configName = '提示词获取';
    const workflow = getCompositionBusinessInfoValue(type, '生成方式', type);
    const style = getCompositionBusinessInfoValue(type, '风格', '-');
    const singer = getCompositionBusinessInfoValue(type, '歌手', '-');
    return `【${configName}】-【${workflow}】-${style}-${singer}`;
}

function initCompositionPromptSelect() {
    const select = document.getElementById('compPromptSelect');
    if (!select) return;

    const currentValue = select.value;
    const optionTypes = ['prompt', 'inspo', 'cover', 'sample'];
    select.innerHTML = '<option value="">-- 请选择跑曲提示词 --</option>' + optionTypes
        .map(type => `<option value="${type}">${getCompositionPromptOptionLabel(type)}</option>`)
        .join('');
    select.value = currentValue;
}

function renderCompositionBusinessInfo(value) {
    const card = document.getElementById('compBusinessInfoCard');
    const list = document.getElementById('compBusinessInfoList');
    if (!list) return;

    const rows = compositionBusinessInfoMap[value] || [];
    if (rows.length === 0) {
        if (card) card.style.display = 'none';
        list.innerHTML = '';
        return;
    }

    if (card) card.style.display = 'block';
    const promptRow = rows.find(([label]) => label === '提示词（style 内容）') || ['提示词（style 内容）', ''];
    const infoRows = rows.filter(([label]) => label !== '提示词（style 内容）');
    list.innerHTML = [
        ...infoRows.map(([label, text]) => `
            <div style="min-width: 0; padding: 10px 12px; border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-50); line-height: 1.45;">
                <div style="color: var(--gray-500); margin-bottom: 4px;">${label}</div>
                <div style="color: ${label === '生成方式' ? 'var(--primary)' : 'var(--gray-900)'}; font-weight: ${label === '生成方式' ? '600' : '500'}; word-break: break-word;">${text}</div>
            </div>
        `),
        `<div data-tooltip="${escapeAttr(promptRow[1])}" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()" style="grid-column: 4; grid-row: 1 / span 2; height: 122px; min-height: 100%; padding: 10px 12px; border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-50); line-height: 1.5; display: flex; flex-direction: column; min-width: 0;">
            <div style="color: var(--gray-500); margin-bottom: 6px;">${promptRow[0]}</div>
            <div style="color: var(--gray-900); font-weight: 500; line-height: 1.55; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; flex: 1;">${promptRow[1]}</div>
        </div>`
    ].join('');
}

let currentCompositionAudioMode = 'inspo';

function openCompositionAudioFileModal(mode = 'inspo') {
    currentCompositionAudioMode = mode;
    openCompositionAudioResourceModal('file');
}

function toggleCompositionAudioMenu(event, mode = 'inspo') {
    if (event) event.stopPropagation();
    currentCompositionAudioMode = mode;
    const menu = document.getElementById('compAudioResourceMenu');
    if (!menu) return;
    const anchor = event?.currentTarget?.parentElement;
    if (anchor && menu.parentElement !== anchor) {
        anchor.appendChild(menu);
    }
    menu.style.display = menu.style.display === 'none' || !menu.style.display ? 'block' : 'none';
}

function openCompositionAudioResourceModal(type) {
    const menu = document.getElementById('compAudioResourceMenu');
    const typeInput = document.getElementById('compAudioResourceType');
    const title = document.getElementById('compAudioResourceModalTitle');
    const fileForm = document.getElementById('compAudioFileForm');
    const linkForm = document.getElementById('compAudioLinkForm');
    if (menu) menu.style.display = 'none';
    if (!typeInput || !title || !fileForm || !linkForm) return;

    typeInput.value = 'file';
    title.innerText = '添加音频文件';
    fileForm.style.display = 'block';
    linkForm.style.display = 'none';
    openModal('compAudioResourceModalOverlay');
}

function closeCompositionAudioResourceModal() {
    closeModal('compAudioResourceModalOverlay');
    const fields = ['compAudioFileInput', 'compAudioLinkName', 'compAudioLinkUrl'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function escapeCompositionText(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getCompositionFileNameFromValue(value, fallback = 'audio.mp3') {
    const raw = String(value || '').trim();
    if (!raw) return fallback;
    const clean = raw.split('?')[0].split('#')[0];
    return clean.split('/').filter(Boolean).pop() || fallback;
}

function getCompositionAudioResourceCard(type, title, value) {
    const fileName = escapeCompositionText(type === 'file' ? title : getCompositionFileNameFromValue(value, title || 'audio.mp3'));
    return `
        <div style="display: flex; flex-direction: column; gap: 14px; min-height: 180px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: #fff;">
          <div style="display: flex; align-items: center; gap: 18px;">
            <span class="badge" style="background: #EFF6FF; color: var(--primary); border: 1px solid #BFDBFE; font-size: 14px; padding: 6px 12px;">文件</span>
            <strong style="font-size: 15px; color: var(--gray-900); word-break: break-word;">${fileName}</strong>
          </div>
          <audio controls style="width: 100%; margin-top: auto;">
            <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
          </audio>
          <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: auto;">
            <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;"><i class="fas fa-download"></i> 下载</button>
                                <button class="btn-primary" style="background: #fff; border: 1px solid var(--primary); color: var(--primary); height: 38px;">重新上传</button>
            <button class="btn-primary" style="background: #fff; border: 1px solid var(--danger); color: var(--danger); height: 38px;">删除</button>
          </div>
        </div>
    `;
}

function confirmCompositionAudioResource() {
    const listIdMap = {
        inspo: 'compInspoAudioResourceList',
        cover: 'compCoverAudioResourceList',
        sample: 'compSampleAudioResourceList'
    };
    const list = document.getElementById(listIdMap[currentCompositionAudioMode] || 'compInspoAudioResourceList');
    if (!list) return;

    let title = '';
    let value = '';
    const fileInput = document.getElementById('compAudioFileInput');
    value = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '';
    title = value;
    if (!value) {
        alert('请选择上传文件');
        return;
    }

    list.insertAdjacentHTML('beforeend', getCompositionAudioResourceCard('file', title, value));
    closeCompositionAudioResourceModal();
}

function handleCompositionPromptChange(value) {
    const configArea = document.getElementById('compAiConfigArea');
    const resultCard = document.getElementById('compGeneratedResultCard');

    const inspoCard = document.getElementById('compInspoAudioCard');
    const coverCard = document.getElementById('compCoverAudioCard');
    const sampleCard = document.getElementById('compSampleAudioCard');
    const emptyCard = document.getElementById('compPromptEmptyCard');

    if (!configArea || !resultCard || !inspoCard || !coverCard || !sampleCard || !emptyCard) return;
    renderCompositionBusinessInfo(value);

    if (value) {
        configArea.style.display = 'flex';

        inspoCard.style.display = 'none';
        coverCard.style.display = 'none';
        sampleCard.style.display = 'none';
        emptyCard.style.display = 'none';

        if (value === 'prompt') {
            emptyCard.style.display = 'flex';
        } else if (value === 'inspo') {
            inspoCard.style.display = 'flex';
        } else if (value === 'cover') {
            coverCard.style.display = 'flex';
        } else if (value === 'sample') {
            sampleCard.style.display = 'flex';
        }
    } else {
        configArea.style.display = 'none';
        resultCard.style.display = 'none';
    }
}

function simulateCompositionGenerate() {
    const btn = document.querySelector('button[onclick="simulateCompositionGenerate()"]');
    if (!btn) return;
    const originalText = btn.innerHTML;
    const resultCard = document.getElementById('compGeneratedResultCard');
    const statusBadge = document.getElementById('compGenerateStatusBadge');
    const failReason = document.getElementById('compGenerateFailReason');

    if (resultCard) resultCard.style.display = 'block';
    if (statusBadge) {
        statusBadge.className = 'badge badge-orange';
        statusBadge.textContent = '生成中';
    }
    if (failReason) failReason.textContent = '-';

    btn.innerHTML = '⏳ 正在请求 API 生成...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        if (statusBadge) {
            statusBadge.className = 'badge badge-green';
            statusBadge.textContent = '生成成功';
        }

        // Auto show uploaded files on step 2 for convenience
        const uploadArea = document.getElementById('compUploadArea');
        const uploadedCard = document.getElementById('compUploadedCard');
        const submitBtn = document.getElementById('compSubmitBtn');
        if (uploadArea && uploadedCard && submitBtn) {
            uploadArea.style.display = 'none';
            uploadedCard.style.display = 'flex';
            submitBtn.disabled = false;
        }

        // Auto select first version by default
        selectCompositionResult(1);

        if (resultCard) {
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1500);
}

function selectCompositionResult(num) {
    const result1Block = document.getElementById('compResult1Block');
    const selectBtn1 = document.getElementById('compSelectBtn1');
    const result2Block = document.getElementById('compResult2Block');
    const selectBtn2 = document.getElementById('compSelectBtn2');
    const finalTrackName = document.getElementById('compFinalTrackName');

    const nextTrackName = '思念的风景_v' + num + '.mp3';
    if (!result1Block || !selectBtn1 || !result2Block || !selectBtn2) {
        if (finalTrackName) finalTrackName.textContent = nextTrackName;
        return;
    }
    if (!finalTrackName) return;

    // Reset all
    result1Block.style.border = '1px solid transparent';
    result1Block.style.background = '#fff';
    result1Block.style.boxShadow = 'none';
    selectBtn1.innerText = '选取此版本';
    selectBtn1.style.background = '#fff';
    selectBtn1.style.color = 'var(--primary)';
    selectBtn1.style.border = '1px solid var(--primary)';

    result2Block.style.border = '1px solid transparent';
    result2Block.style.background = '#fff';
    result2Block.style.boxShadow = 'none';
    selectBtn2.innerText = '选取此版本';
    selectBtn2.style.background = '#fff';
    selectBtn2.style.color = 'var(--primary)';
    selectBtn2.style.border = '1px solid var(--primary)';

    // Set active
    const targetBlock = num === 1 ? result1Block : result2Block;
    const targetBtn = num === 1 ? selectBtn1 : selectBtn2;

    targetBlock.style.border = '1px solid var(--primary)';
    targetBlock.style.background = '#fff';
    targetBlock.style.boxShadow = '0 0 0 2px rgba(51,112,255,0.08)';
    targetBtn.innerText = '✅ 选取此版本';
    targetBtn.style.background = '#fff';
    targetBtn.style.color = 'var(--primary)';
    targetBtn.style.border = '1px solid var(--primary)';

    // Update step 2 final track name
    finalTrackName.textContent = nextTrackName;
}

function simulateRealCompositionUpload() {
    const uploadArea = document.getElementById('compUploadArea');
    const uploadProgress = document.getElementById('compUploadProgress');
    const uploadedCard = document.getElementById('compUploadedCard');
    const submitBtn = document.getElementById('compSubmitBtn');

    if (!uploadArea || !uploadProgress || !uploadedCard || !submitBtn) return;

    uploadArea.style.display = 'none';
    uploadProgress.style.display = 'block';

    setTimeout(() => {
        uploadProgress.style.display = 'none';
        uploadedCard.style.display = 'flex';
        submitBtn.disabled = false;
    }, 1500);
}

function resetCompositionUpload() {
    const uploadArea = document.getElementById('compUploadArea');
    const uploadedCard = document.getElementById('compUploadedCard');
    const submitBtn = document.getElementById('compSubmitBtn');

    if (!uploadArea || !uploadedCard || !submitBtn) return;

    uploadedCard.style.display = 'none';
    uploadArea.style.display = 'flex';
    submitBtn.disabled = true;
}

function showCompositionSubmitModal() {
    openModal('compSubmitModalOverlay');
}

function closeCompositionSubmitModal() {
    closeModal('compSubmitModalOverlay');
}

function confirmCompositionSubmit() {
    const remarkInput = document.getElementById('compSubmitRemark');
    const remark = remarkInput ? remarkInput.value.trim() : '';
    closeModal('compSubmitModalOverlay');

    const container = document.querySelector('#manual-composition-page .content-wrapper');
    if (container) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                <div style="font-size: 48px; color: var(--success);">✓</div>
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">提交成功</h3>
                <p style="color: var(--gray-600); font-size: 14px;">已提交成品录音，交由工作流处理中...</p>
                ${remark ? `<p style="background: var(--gray-50); padding: 10px 16px; border-radius: 6px; border: 1px solid var(--gray-200); font-size: 13px; color: var(--gray-700);">附带备注: ${remark}</p>` : ''}
            </div>
        `;
    }
    completeActiveTaskProcessingTask('submit', remark);
}

function showCompositionAbortModal() {
    openModal('compAbortModalOverlay');
}

function closeCompositionAbortModal() {
    closeModal('compAbortModalOverlay');
    const reasonInput = document.getElementById('compAbortReason');
    if (reasonInput) reasonInput.value = '';
}

function confirmCompositionAbort() {
    const reasonInput = document.getElementById('compAbortReason');
    const reason = reasonInput ? reasonInput.value.trim() : '';

    if (!reason) {
        alert('请输入终止任务的原因');
        return;
    }

    closeModal('compAbortModalOverlay');

    const container = document.querySelector('#manual-composition-page .content-wrapper');
    if (container) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                <div style="font-size: 48px; color: var(--danger);">✕</div>
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">任务已终止</h3>
                <p style="background: #FFF0F0; color: var(--danger); padding: 10px 16px; border-radius: 6px; font-size: 13px;">终止原因: ${reason}</p>
            </div>
        `;
    }
    completeActiveTaskProcessingTask('abort', reason);
}

function simulateCompositionRejected() {
    const step2RejectBlock = document.getElementById('compStep2RejectReasonBlock');
    if (step2RejectBlock) {
        switchCompositionStep(2);
        step2RejectBlock.style.display = 'block';
        step2RejectBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==================== 工作台 (曲审核) 业务逻辑 ====================
let isSongReviewReject = false;
let currentSongRating = '';

function initSongReviewCoverPanel() {
    const modeEl = document.getElementById('srWorkflowMode');
    const coverCard = document.getElementById('srCoverAudioCard');
    if (modeEl && coverCard) {
        const mode = modeEl.textContent.trim().toLowerCase();
        if (mode === 'cover' || mode === 'prompt') {
            coverCard.style.display = 'block';
        } else {
            coverCard.style.display = 'none';
        }
    }
}

function updateZeroStarButtonStates() {
    document.querySelectorAll('.sr-zero-btn').forEach(btn => {
        const input = document.getElementById(btn.dataset.zeroInput);
        btn.classList.toggle('active', !!input?.checked);
    });
}

function handleStarRatingChange(radio) {
    if (radio?.checked) {
        const zeroInput = document.querySelector(`.sr-zero-input[name="${radio.name}"]`);
        if (zeroInput) zeroInput.checked = false;
    }

    updateZeroStarButtonStates();
    calculateSongRating();
}

function toggleZeroStarRating(inputId) {
    const zeroInput = document.getElementById(inputId);
    if (!zeroInput) return;

    const shouldSelect = !zeroInput.checked;
    document.querySelectorAll(`input[name="${zeroInput.name}"]`).forEach(input => {
        input.checked = false;
    });
    zeroInput.checked = shouldSelect;

    updateZeroStarButtonStates();
    calculateSongRating();
}

function calculateSongRating() {
    const groups = ['sr_melody', 'sr_lyrics', 'sr_vocal', 'sr_audio_quality', 'sr_arrangement'];
    let total = 0;
    let count = 0;
    let has0 = false;
    let has1 = false;

    groups.forEach(g => {
        const checked = document.querySelector(`input[name="${g}"]:checked`);
        if (checked) {
            const val = parseInt(checked.value);
            total += val;
            if (val === 0) has0 = true;
            if (val === 1) has1 = true;
            count++;
        }
    });

    updateZeroStarButtonStates();

    document.querySelectorAll('.sr-quick-reject-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.borderColor = 'var(--gray-300)';
        btn.style.color = 'var(--gray-600)';
    });

    if (has0) {
        const finalSection = document.getElementById('srFinalSection');
        if (finalSection) finalSection.style.display = 'block';
        currentSongRating = 'C';
        isSongReviewReject = true;
        updateSongReviewUI('var(--danger)', 'var(--danger-light)', 'C');
    } else if (count === 5) {
        const finalSection = document.getElementById('srFinalSection');
        if (finalSection) finalSection.style.display = 'block';
        
        let color, bg;
        if (total < 7) {
            currentSongRating = 'C'; color = 'var(--danger)'; bg = 'var(--danger-light)'; isSongReviewReject = true;
        } else if (!has1 && (total === 14 || total === 15)) {
            currentSongRating = 'S'; color = '#722ed1'; bg = '#f9f0ff'; isSongReviewReject = false;
        } else if (!has1 && (total === 12 || total === 13)) {
            currentSongRating = 'A+'; color = 'var(--success)'; bg = 'var(--success-light)'; isSongReviewReject = false;
        } else if ((!has1 && (total === 10 || total === 11)) || (has1 && (total === 12 || total === 13))) {
            currentSongRating = 'A'; color = 'var(--success)'; bg = 'var(--success-light)'; isSongReviewReject = false;
        } else if (!has0 && total >= 7 && total <= 11) {
            currentSongRating = 'B+'; color = 'var(--warning)'; bg = 'var(--warning-light)'; isSongReviewReject = true;
        } else {
            currentSongRating = 'C'; color = 'var(--danger)'; bg = 'var(--danger-light)'; isSongReviewReject = true;
        }

        updateSongReviewUI(color, bg);
    } else {
        const finalSection = document.getElementById('srFinalSection');
        if (finalSection) finalSection.style.display = 'none';
    }
}

function quickRejectSongReview(reason, btnEl) {
    if (!btnEl) return;

    const isActive = btnEl.classList.contains('active');

    if (isActive) {
        btnEl.classList.remove('active');
        btnEl.style.background = '#fff';
        btnEl.style.borderColor = 'var(--gray-300)';
        btnEl.style.color = 'var(--gray-600)';
    } else {
        document.querySelectorAll('.stars-rating input').forEach(radio => radio.checked = false);
        document.querySelectorAll('.sr-zero-input').forEach(radio => radio.checked = false);
        updateZeroStarButtonStates();
        btnEl.classList.add('active');
        btnEl.style.background = 'var(--danger-light)';
        btnEl.style.borderColor = 'var(--danger)';
        btnEl.style.color = 'var(--danger)';
    }

    const selectedReasons = Array.from(document.querySelectorAll('.sr-quick-reject-btn.active'))
        .map(btn => btn.textContent.trim());

    const remarkInput = document.getElementById('srRemarkInput');
    const finalSection = document.getElementById('srFinalSection');

    if (selectedReasons.length === 0) {
        if (finalSection) finalSection.style.display = 'none';
        isSongReviewReject = false;
        if (remarkInput) remarkInput.value = '';
        return;
    }

    if (finalSection) finalSection.style.display = 'block';

    currentSongRating = 'C';
    isSongReviewReject = true;
    updateSongReviewUI('var(--danger)', 'var(--danger-light)', 'C');

    if (remarkInput) remarkInput.value = selectedReasons.join('、');
}

function updateSongReviewUI(color, bg, displayRating = currentSongRating) {
    const badge = document.getElementById('srFinalRatingBadge');
    if (badge) {
        badge.textContent = displayRating;
        badge.style.color = color;
        badge.style.backgroundColor = bg;
        badge.style.border = `1px solid ${color}`;
    }

    const remarkLabel = document.getElementById('srRemarkLabel');
    const remarkInput = document.getElementById('srRemarkInput');
    const rejectBtn = document.getElementById('srRejectBtn');
    const submitBtn = document.getElementById('srSubmitBtn');

    if (!remarkLabel || !remarkInput || !rejectBtn || !submitBtn) return;

    if (isSongReviewReject) {
        remarkLabel.innerHTML = '原因 <span style="color: var(--danger);">*</span>';
        remarkInput.placeholder = '请填写打回或终止的具体原因...';
        rejectBtn.style.display = 'inline-flex';
        submitBtn.className = 'btn-primary';
        submitBtn.style.backgroundColor = 'var(--danger)';
        submitBtn.style.borderColor = 'var(--danger)';
        submitBtn.textContent = '终止任务';
    } else {
        remarkLabel.innerHTML = '综合评语 <span style="color: var(--gray-400);">(选填)</span>';
        remarkInput.placeholder = '例如：副歌部分的人声有点闷，但整体情感非常饱满...';
        rejectBtn.style.display = 'none';
        submitBtn.className = 'btn-primary';
        submitBtn.style.backgroundColor = 'var(--primary)';
        submitBtn.style.borderColor = 'var(--primary)';
        submitBtn.textContent = `✅ 确认审核通过`;
    }
}

function resetSongReview() {
    isSongReviewReject = false;
    currentSongRating = '';
    document.querySelectorAll('.stars-rating input').forEach(radio => radio.checked = false);
    document.querySelectorAll('.sr-zero-input').forEach(radio => radio.checked = false);
    updateZeroStarButtonStates();
    const remarkInput = document.getElementById('srRemarkInput');
    if (remarkInput) remarkInput.value = '';
    
    const finalSection = document.getElementById('srFinalSection');
    if (finalSection) finalSection.style.display = 'none';
    const rejectBtn = document.getElementById('srRejectBtn');
    if (rejectBtn) rejectBtn.style.display = 'none';

    document.querySelectorAll('.sr-quick-reject-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.borderColor = 'var(--gray-300)';
        btn.style.color = 'var(--gray-600)';
    });
}

function openSongReviewAbortModal() {
    const modal = document.getElementById('srAbortModalOverlay');
    if (modal) modal.style.display = 'flex';
}

function closeSongReviewAbortModal() {
    const modal = document.getElementById('srAbortModalOverlay');
    if (modal) modal.style.display = 'none';
}

function confirmSongReviewAbort() {
    const reason = document.getElementById('srRemarkInput')?.value.trim() || '';
    closeSongReviewAbortModal();

    const container = getSongReviewContentContainer();
    if (container) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                <div style="font-size: 48px; color: var(--danger);">✕</div>
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">任务已终止</h3>
                <p style="color: var(--gray-600); font-size: 14px;">当前任务已终止，工作流将停止继续流转。</p>
            </div>
        `;
    }
    completeActiveTaskProcessingTask('abort', reason);
}

function confirmSongReviewSubmit() {
    const remarkInput = document.getElementById('srRemarkInput');
    const remark = remarkInput ? remarkInput.value.trim() : '';

    const container = getSongReviewContentContainer();
    if (container) {
        container.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                <div style="font-size: 48px; color: var(--success);">✓</div>
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">页面已关闭</h3>
                <p style="color: var(--gray-600); font-size: 14px;">交由工作流处理中...</p>
                <p style="background: var(--gray-50); padding: 10px 16px; border-radius: 6px; border: 1px solid var(--gray-200); font-size: 13px; color: var(--gray-700);">审核结果: <strong>${currentSongRating}</strong> ${remark ? `(${remark})` : ''}</p>
            </div>
        `;
    }
    completeActiveTaskProcessingTask('submit', remark);
}

function getSongReviewContentContainer() {
    return document.querySelector('#taskProcessingContent .content-wrapper')
        || document.querySelector('#song-review-page .content-wrapper');
}

function rejectSongReview() {
    if (!isSongReviewReject) return;
    const reason = document.getElementById('srRemarkInput')?.value.trim() || '';
    if (!reason) {
        alert('请填写原因！');
        document.getElementById('srRemarkInput')?.focus();
        return;
    }

    openConfirmDialog('确认打回', '是否确认打回当前任务？', '确认打回', true, () => {
        const container = getSongReviewContentContainer();
        if (container) {
            container.innerHTML = `
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow-sm); flex-direction: column; gap: 16px; padding: 40px;">
                    <div style="font-size: 48px; color: var(--warning);">↩</div>
                    <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">任务已打回</h3>
                    <p style="color: var(--gray-600); font-size: 14px;">当前任务已打回，工作流将返回上一处理节点。</p>
                </div>
            `;
        }
        completeActiveTaskProcessingTask('reject', reason);
    });
}

function submitSongReview() {
    if (isSongReviewReject) {
        const reason = document.getElementById('srRemarkInput')?.value.trim() || '';
        if (!reason) {
            alert('请填写原因！');
            document.getElementById('srRemarkInput')?.focus();
            return;
        }
        openSongReviewAbortModal();
    } else {
        confirmSongReviewSubmit();
    }
}

// ==================== 资产管理 (歌手名称表) 业务逻辑 ====================
let singersData = [
    { id: '1001', name: '刘师砚', internalName: '石砚', gender: '男', style: '中年下沉', status: '正常' },
    { id: '1002', name: '莫云', internalName: '云疏', gender: '男', style: '中年下沉', status: '正常' },
    { id: '1003', name: '沈砚川', internalName: '康乐', gender: '男', style: '年轻下沉', status: '正常' },
    { id: '1004', name: '云峥', internalName: '郑云', gender: '男', style: '80年代金曲', status: '正常' },
    { id: '1005', name: '顾书萤', internalName: '书莹', gender: '女', style: '年轻下沉', status: '正常' },
    { id: '1006', name: '沈韵娇', internalName: '云娇', gender: '女', style: '年轻下沉', status: '正常' },
    { id: '1007', name: '苏星瑶', internalName: '欣瑶', gender: '女', style: '年轻下沉', status: '正常' }
];

function renderSingersTable(data = singersData) {
    const tbody = document.querySelector('#singerTable tbody');
    const emptyState = document.getElementById('singerEmptyState');
    if (!tbody || !emptyState) return;

    tbody.innerHTML = '';
    
    if (data.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }
    emptyState.style.display = 'none';

    data.forEach(item => {
        const isNormal = item.status === '正常';
        const statusBadge = isNormal 
            ? `<span class="badge" style="border: 1px solid var(--success); color: var(--success); background: var(--success-light);">正常</span>`
            : `<span class="badge" style="border: 1px solid var(--danger); color: var(--danger); background: var(--danger-light);">已禁用</span>`;
        const disableText = isNormal ? '禁用' : '启用';

        const row = document.createElement('tr');
        row.id = `singer-row-${item.id}`;
        row.innerHTML = `
            <td style="color: var(--gray-500);">${item.id}</td>
            <td><img src="https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=f5f5f5" style="width: 32px; height: 32px; border-radius: 50%; display: block;" alt="avatar"></td>
            <td style="font-weight: 600; color: var(--gray-900);">${item.name}</td>
            <td style="color: var(--gray-700);">${item.internalName || '-'}</td>
            <td>${item.gender}</td>
            <td><span class="badge" style="color: var(--primary); background: var(--primary-light);">${item.style}</span></td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn-text" onclick="openSingerDrawer('edit', '${item.id}')">详情</button>
                <button class="btn-text danger" id="disable-btn-${item.id}" onclick="toggleDisableSinger('${item.id}')" style="color: ${isNormal ? 'var(--danger)' : 'var(--success)'};">${disableText}</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function doSingerSearch() {
    const query = document.getElementById('singerSearchInput').value.trim().toLowerCase();
    const loading = document.getElementById('singerTableLoading');
    if (loading) loading.style.display = 'flex';

    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        if (!query) {
            renderSingersTable(singersData);
            return;
        }
        const filtered = singersData.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.internalName.toLowerCase().includes(query) || 
            item.style.toLowerCase().includes(query)
        );
        renderSingersTable(filtered);
    }, 400);
}

function resetSingerSearch() {
    const input = document.getElementById('singerSearchInput');
    if (input) input.value = '';
    renderSingersTable(singersData);
}

function openSingerDrawer(mode, id = null) {
    const overlay = document.getElementById('singerDrawerOverlay');
    const drawer = document.getElementById('singerDrawer');
    if (!overlay || !drawer) return;

    overlay.style.display = 'block';
    setTimeout(() => {
        drawer.classList.add('active');
    }, 50);

    const title = document.getElementById('singerDrawerTitle');
    const btnSubmit = document.getElementById('btnSingerSubmit');
    const editIdInput = document.getElementById('singerEditId');
    const nameInput = document.getElementById('inputSingerName');
    const internalNameInput = document.getElementById('inputSingerInternalName');
    const genderSelect = document.getElementById('inputSingerGender');
    const styleInput = document.getElementById('inputSingerStyle');

    if (mode === 'add') {
        title.innerText = '新增歌手';
        btnSubmit.innerText = '确认新增';
        editIdInput.value = '';
        nameInput.value = '';
        internalNameInput.value = '';
        genderSelect.value = '男';
        styleInput.value = '';
    } else {
        title.innerText = '歌手详情';
        btnSubmit.innerText = '保存修改';
        editIdInput.value = id;

        const singer = singersData.find(s => s.id === id);
        if (singer) {
            nameInput.value = singer.name;
            internalNameInput.value = singer.internalName;
            genderSelect.value = singer.gender;
            styleInput.value = singer.style;
        }
    }
}

function closeSingerDrawer() {
    const overlay = document.getElementById('singerDrawerOverlay');
    const drawer = document.getElementById('singerDrawer');
    if (!overlay || !drawer) return;

    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function saveSingerDrawer() {
    const editId = document.getElementById('singerEditId').value;
    const name = document.getElementById('inputSingerName').value.trim();
    const internalName = document.getElementById('inputSingerInternalName').value.trim();
    const gender = document.getElementById('inputSingerGender').value;
    const style = document.getElementById('inputSingerStyle').value.trim();

    if (!name) {
        alert('歌手名称不能为空！');
        return;
    }

    if (editId) {
        // Edit mode
        const singer = singersData.find(s => s.id === editId);
        if (singer) {
            singer.name = name;
            singer.internalName = internalName;
            singer.gender = gender;
            singer.style = style || '未知';
        }
    } else {
        // Add mode
        const newId = String(1000 + singersData.length + 1);
        singersData.push({
            id: newId,
            name: name,
            internalName: internalName,
            gender: gender,
            style: style || '未知',
            status: '正常'
        });
    }

    renderSingersTable();
    closeSingerDrawer();
}

function toggleDisableSinger(id) {
    const singer = singersData.find(s => s.id === id);
    if (!singer) return;

    if (singer.status === '正常') {
        openConfirmDialog(
            '禁用确认',
            `确认禁用歌手 "${singer.name}" 吗？`,
            '确认禁用',
            true,
            () => {
                singer.status = '已禁用';
                renderSingersTable();
            }
        );
    } else {
        openConfirmDialog(
            '启用确认',
            `确认重新启用歌手 "${singer.name}" 吗？`,
            '确认启用',
            false,
            () => {
                singer.status = '正常';
                renderSingersTable();
            }
        );
    }
}// ==================== REFERENCE LIBRARY (对标曲库) LOGIC ====================
let refSongsData = [
    {
        playlistId: '7713574197',
        id: '1001',
        name: '星光璀璨',
        singer: '虚拟歌手 小A',
        lyrics: '穿越无尽黑夜的星光，带走我所有的悲伤和彷徨。让梦想在星空下翱翔，指引着我们前行的方向。不管未来的路有多漫长，只要心中有光，就有希望。',
        styles: ['流行', '轻快'],
        status: '已使用'
    },
    {
        playlistId: '8294156123',
        id: '1002',
        name: '都市漫游',
        singer: '独立音乐人 B',
        lyrics: '霓虹灯下的晚风，吹不散心中的迷雾。走在繁华的街头，寻找着属于我的归宿。都市的节奏太快，我们都在不停地奔跑，是否忘记了最初的微笑。',
        styles: ['R&B', '都市', '慵懒'],
        status: '已入库'
    },
    {
        playlistId: '8294156123',
        id: '1003',
        name: '旧日时光',
        singer: '歌手 C',
        lyrics: '翻开那本泛黄的日记，每一页都写满了过去。泛黄的照片里，有着我们青春的印记。岁月的流逝带走了美丽，却带不走深藏心底的回忆。',
        styles: ['民谣', '怀旧'],
        status: '已禁用'
    }
];

function normalizeRefSongStatus(status) {
    return status === '使用中' ? '已使用' : status;
}

function normalizePlaylistId(value) {
    const match = String(value || '').match(/\d+/g);
    return match ? match.join('') : '';
}

function getRefSongStyleOptions() {
    return [...new Set(refSongsData.flatMap(item => item.styles || []))].filter(Boolean);
}

function initRefLibFilters() {
    const styleSelect = document.getElementById('refLibSearchStyle');
    if (!styleSelect) return;
    const currentValue = styleSelect.value;
    styleSelect.innerHTML = '<option value="">全部</option>' + getRefSongStyleOptions()
        .map(style => `<option value="${style}">${style}</option>`)
        .join('');
    styleSelect.value = currentValue;
}

function renderRefSongsTable() {
    const tbody = document.getElementById('refLibTableBody');
    if (!tbody) return;

    const nameQuery = (document.getElementById('refLibSearchName')?.value || '').trim().toLowerCase();
    const singerQuery = (document.getElementById('refLibSearchSinger')?.value || '').trim().toLowerCase();
    const styleValue = document.getElementById('refLibSearchStyle')?.value || '';
    const statusValue = document.getElementById('refLibSearchStatus')?.value || '';
    
    // Filter data
    const filtered = refSongsData.filter(item => {
        const nameMatch = !nameQuery || item.name.toLowerCase().includes(nameQuery);
        const singerMatch = !singerQuery || item.singer.toLowerCase().includes(singerQuery);
        const styleMatch = !styleValue || item.styles.includes(styleValue);
        const statusMatch = !statusValue || normalizeRefSongStatus(item.status) === statusValue;
        return nameMatch && singerMatch && styleMatch && statusMatch;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--gray-500); padding: 32px;">暂无匹配的参考资产数据</td></tr>';
        return;
    }

    filtered.forEach(item => {
        // Status Badge Style
        let statusBadge = '';
        const displayStatus = normalizeRefSongStatus(item.status);
        if (displayStatus === '已入库') {
            statusBadge = '<span class="badge badge-blue">已入库</span>';
        } else if (displayStatus === '已使用') {
            statusBadge = '<span class="badge badge-gray">已使用</span>';
        } else if (displayStatus === '已禁用') {
            statusBadge = '<span class="badge badge-red">已禁用</span>';
        }

        // Styles Tags
        const stylesHtml = item.styles.map(s => `
            <span class="tag-style" style="display:inline-block; padding: 2px 8px; font-size: 12px; background: #EBF5FF; color: #1677FF; border: 1px solid #91CAFF; border-radius: 4px; margin-right: 4px; margin-bottom: 4px;">${s}</span>
        `).join('');

        // Action Button Text
        const isNormal = displayStatus !== '已禁用';
        const disableText = isNormal ? '禁用' : '启用';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: var(--gray-600); font-family: monospace;">${normalizePlaylistId(item.playlistId)}</td>
            <td style="color: var(--gray-600);">${item.id}</td>
            <td style="font-weight: 500;">《${item.name}》</td>
            <td style="color: var(--gray-700);">${item.singer}</td>
            <td>
                <div class="batch-playlist-lyrics ref-library-lyrics" title="${escapeAttr(item.lyrics)}">
                    ${item.lyrics}
                </div>
            </td>
            <td>${stylesHtml}</td>
            <td>${statusBadge}</td>
            <td>
                <div style="display: flex; gap: 12px;">
                    <button class="btn-text" onclick="openRefLibDrawer('${item.id}')">详情</button>
                    <button class="btn-text danger" onclick="toggleDisableRefSong('${item.id}')" style="color: ${isNormal ? 'var(--danger)' : 'var(--success)'};">${disableText}</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function doRefLibSearch() {
    const loader = document.getElementById('refLibTableLoading');
    if (loader) loader.style.display = 'flex';

    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        renderRefSongsTable();
    }, 300);
}

function resetRefLibSearch() {
    const nameInput = document.getElementById('refLibSearchName');
    const singerInput = document.getElementById('refLibSearchSinger');
    const styleSelect = document.getElementById('refLibSearchStyle');
    const statusSelect = document.getElementById('refLibSearchStatus');
    if (nameInput) nameInput.value = '';
    if (singerInput) singerInput.value = '';
    if (styleSelect) styleSelect.value = '';
    if (statusSelect) statusSelect.value = '';
    renderRefSongsTable();
}

function openRefLibDrawer(id) {
    const item = refSongsData.find(s => s.id === id);
    if (!item) return;

    document.getElementById('refLibEditId').value = item.id;
    document.getElementById('inputRefSongName').value = item.name;
    document.getElementById('inputRefSingerName').value = item.singer;
    document.getElementById('inputRefLyrics').value = item.lyrics;
    document.getElementById('inputRefStyles').value = item.styles.join(', ');

    const overlay = document.getElementById('refLibDrawerOverlay');
    const drawer = document.getElementById('refLibDrawer');
    if (overlay && drawer) {
        overlay.style.display = 'block';
        setTimeout(() => {
            drawer.classList.add('active');
        }, 10);
    }
}

function closeRefLibDrawer() {
    const overlay = document.getElementById('refLibDrawerOverlay');
    const drawer = document.getElementById('refLibDrawer');
    if (drawer) {
        drawer.classList.remove('active');
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
        }, 300);
    }
}

function saveRefLibDrawer() {
    const id = document.getElementById('refLibEditId').value;
    const name = (document.getElementById('inputRefSongName').value || '').trim();
    const singer = (document.getElementById('inputRefSingerName').value || '').trim();
    const lyrics = (document.getElementById('inputRefLyrics').value || '').trim();
    const stylesStr = document.getElementById('inputRefStyles').value || '';

    if (!name || !singer || !lyrics) {
        alert('歌名、歌手和歌词为必填项！');
        return;
    }

    const item = refSongsData.find(s => s.id === id);
    if (item) {
        item.name = name;
        item.singer = singer;
        item.lyrics = lyrics;
        item.styles = stylesStr.split(',').map(s => s.trim()).filter(Boolean);
    }

    initRefLibFilters();
    renderRefSongsTable();
    closeRefLibDrawer();
}

function toggleDisableRefSong(id) {
    const item = refSongsData.find(s => s.id === id);
    if (!item) return;

    if (item.status !== '已禁用') {
        openConfirmDialog(
            '禁用确认',
            `确认禁用参考歌曲 "${item.name}" 吗？禁用后将不可再作为跑曲下发参考。`,
            '确认禁用',
            true,
            () => {
                item.status = '已禁用';
                renderRefSongsTable();
            }
        );
    } else {
        openConfirmDialog(
            '启用确认',
            `确认重新启用参考歌曲 "${item.name}" 吗？`,
            '确认启用',
            false,
            () => {
                item.status = '已入库';
                renderRefSongsTable();
            }
        );
    }
}

function simulateParsePlaylist() {
    const url = document.getElementById('inputPlaylistUrl').value || '';
    if (!url) {
        alert('请粘贴有效的 QQ 音乐链接或歌单 ID');
        return;
    }

    const loader = document.getElementById('refLibTableLoading');
    if (loader) loader.style.display = 'flex';

    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        alert('歌单解析成功！已拉取最新曲目列表。');
        
        // Render parse choices in importSongList
        const songList = document.getElementById('importSongList');
        if (songList) {
            songList.innerHTML = `
                <table class="data-table">
                    <thead><tr><th><input type="checkbox" class="table-checkbox import-select-all-checkbox" id="importSelectAllSongs" checked onchange="toggleAllImportSongs(this)"></th><th>歌名</th><th>对标 ID</th><th>歌词</th></tr></thead>
                    <tbody>
                        <tr class="song-list-item" data-author="周杰伦"><td><label class="import-song-index"><input type="checkbox" class="table-checkbox" name="importSongCheck" value="0" checked onchange="updateImportModalSummary()">1</label></td><td><span class="song-title">七里香</span></td><td>993782</td><td><div class="batch-playlist-lyrics" title="窗外的麻雀 在电线杆上多嘴 你说这一句 很有夏天的感觉">窗外的麻雀 在电线杆上多嘴 你说这一句 很有夏天的感觉</div></td></tr>
                        <tr class="song-list-item" data-author="周杰伦"><td><label class="import-song-index"><input type="checkbox" class="table-checkbox" name="importSongCheck" value="1" checked onchange="updateImportModalSummary()">2</label></td><td><span class="song-title">夜曲</span></td><td>998172</td><td><div class="batch-playlist-lyrics" title="一群嗜血的蚂蚁 被腐肉所吸引 我面无表情 看孤独的风景">一群嗜血的蚂蚁 被腐肉所吸引 我面无表情 看孤独的风景</div></td></tr>
                        <tr class="song-list-item imported" data-author="周杰伦"><td><label class="import-song-index"><input type="checkbox" class="table-checkbox" disabled name="importSongCheck" value="2">3</label></td><td><span class="song-title">青花瓷</span></td><td>771812</td><td><div class="batch-playlist-lyrics" title="素胚勾勒出青花 笔锋浓转淡 瓶身描绘的牡丹一如你初妆">素胚勾勒出青花 笔锋浓转淡 瓶身描绘的牡丹一如你初妆</div></td></tr>
                    </tbody>
                </table>
            `;
        }
        updateImportModalSummary();
    }, 400);
}

function toggleAllImportSongs(masterCheckbox = null) {
    const checks = document.querySelectorAll('input[name="importSongCheck"]:not(:disabled)');
    const shouldCheck = masterCheckbox ? masterCheckbox.checked : Array.from(checks).some(c => !c.checked);
    checks.forEach(c => c.checked = shouldCheck);
    updateImportModalSummary();
}

function updateImportModalSummary() {
    const total = document.querySelectorAll('input[name="importSongCheck"]').length;
    const checked = document.querySelectorAll('input[name="importSongCheck"]:checked').length;
    const enabledChecks = document.querySelectorAll('input[name="importSongCheck"]:not(:disabled)');
    const checkedEnabled = document.querySelectorAll('input[name="importSongCheck"]:not(:disabled):checked');
    
    const summary = document.getElementById('importModalSummary');
    if (summary) summary.innerText = `共 ${total} 首 · 已选 ${checked} 首`;

    const btn = document.getElementById('btnConfirmImport');
    if (btn) btn.innerText = `导入 ${checked} 首`;

    const master = document.getElementById('importSelectAllSongs');
    if (master) {
        master.checked = enabledChecks.length > 0 && checkedEnabled.length === enabledChecks.length;
        master.indeterminate = checkedEnabled.length > 0 && checkedEnabled.length < enabledChecks.length;
    }
}

function confirmImportPlaylist() {
    const playlistId = normalizePlaylistId(document.getElementById('inputPlaylistUrl').value || '7713574197');
    const tagStr = document.getElementById('inputImportTags').value || '';
    const styles = tagStr.split(',').map(s => s.trim()).filter(Boolean);

    const checkedBoxes = document.querySelectorAll('input[name="importSongCheck"]:checked');
    if (checkedBoxes.length === 0) {
        alert('请选择至少一首歌曲进行导入！');
        return;
    }

    const sampleLyrics = {
        '七里香': '雨下整夜，我的爱溢出就像雨水。院子落叶，跟我的思念厚厚一叠。几句是非，也无法将我的热情冷却。你出现在我诗的每一页。',
        '夜曲': '为你弹奏肖邦的夜曲，纪念我死去的爱情。而我为你隐姓埋名，在每个酒馆弹琴。手在键盘敲很轻，我給的思念很小心，你听得到。'
    };

    checkedBoxes.forEach(box => {
        const itemRow = box.closest('.song-list-item');
        const title = itemRow.querySelector('.song-title').innerText;
        const author = itemRow.dataset.author || itemRow.querySelector('.song-author')?.innerText || '周杰伦';

        const maxId = Math.max(...refSongsData.map(s => parseInt(s.id)));
        const newId = String(maxId + 1);

        refSongsData.push({
            playlistId: playlistId,
            id: newId,
            name: title,
            singer: author,
            lyrics: sampleLyrics[title] || '（导入抓取歌词成功）这里是导入的歌词样例段落。',
            styles: styles.length > 0 ? styles : ['流行'],
            status: '已入库'
        });
    });

    renderRefSongsTable();
    closeModal('importModal');
    alert(`成功导入 ${checkedBoxes.length} 首歌曲至参考资产库！`);
}

// ==========================================
// 节点配置管理 (节点类型库 & 节点配置库) 数据与逻辑
// ==========================================

let nodeTypesData = [
  {
    id: "1",
    typeName: "人工作词",
    nodeType: "词",
    typeAttr: "人工节点",
    isConfigured: "是",
    inputFields: '{"task_desc": "string", "ref_lyrics": "string"}',
    configFields: '{"word_count": "integer", "style_tags": "array"}',
    outputFields: '{"lyrics_doc": "object"}',
    version: "V1.0.0",
    changelog: "初始版本",
    status: "正常",
    creator: "张三",
    createTime: "2026-05-10",
    retryCount: 3,
    retryLogic: "FIXED",
    retryDelay: 10,
    timeout: 3600,
    responseTimeout: 600,
    timeoutPolicy: "TIME_OUT_WF"
  },
  {
    id: "2",
    typeName: "AI 作曲",
    nodeType: "曲",
    typeAttr: "机器节点",
    isConfigured: "是",
    inputFields: '{"lyrics": "string", "prompt": "string", "style": "string"}',
    configFields: '{"model_version": "string", "influence": "number"}',
    outputFields: '{"demo_audio": "url"}',
    version: "V1.0.0",
    changelog: "基础能力构建",
    status: "正常",
    creator: "李四",
    createTime: "2026-05-11",
    retryCount: 3,
    retryLogic: "FIXED",
    retryDelay: 10,
    timeout: 3600,
    responseTimeout: 600,
    timeoutPolicy: "TIME_OUT_WF"
  },
  {
    id: "3",
    typeName: "歌词审核",
    nodeType: "词审核",
    typeAttr: "机器节点",
    isConfigured: "是",
    inputFields: '{"lyrics_doc": "object", "review_standard": "string"}',
    configFields: '{"dimension_weights": "object"}',
    outputFields: '{"review_result": "boolean", "comments": "string"}',
    version: "V1.0.0",
    changelog: "添加维稳校验",
    status: "正常",
    creator: "王五",
    createTime: "2026-05-12",
    retryCount: 3,
    retryLogic: "FIXED",
    retryDelay: 10,
    timeout: 3600,
    responseTimeout: 600,
    timeoutPolicy: "TIME_OUT_WF"
  },
  {
    id: "4",
    typeName: "Cover 生成",
    nodeType: "曲",
    typeAttr: "机器节点",
    isConfigured: "否",
    inputFields: '{"origin_audio": "url", "singer_prompt": "string"}',
    configFields: '{"vocal_params": "object", "version": "string"}',
    outputFields: '{"cover_audio": "url"}',
    version: "V1.0.0",
    changelog: "修复音轨重叠",
    status: "已禁用",
    creator: "赵六",
    createTime: "2026-05-13",
    retryCount: 3,
    retryLogic: "FIXED",
    retryDelay: 10,
    timeout: 3600,
    responseTimeout: 600,
    timeoutPolicy: "TIME_OUT_WF"
  },
  {
    id: "5",
    typeName: "人工混音",
    nodeType: "作曲",
    typeAttr: "人工节点",
    isConfigured: "否",
    inputFields: '{"vocal_track": "url", "inst_track": "url"}',
    configFields: '{"mix_template": "string", "effects": "array"}',
    outputFields: '{"final_mix": "url"}',
    version: "V1.0.0",
    changelog: "初始版本",
    status: "正常",
    creator: "张三",
    createTime: "2026-05-14",
    retryCount: 3,
    retryLogic: "FIXED",
    retryDelay: 10,
    timeout: 3600,
    responseTimeout: 600,
    timeoutPolicy: "TIME_OUT_WF"
  },
  {
    id: "6",
    typeName: "曲审核",
    nodeType: "曲审核",
    typeAttr: "人工节点",
    isConfigured: "否",
    inputFields: '{"audio": "url", "lyrics": "string"}',
    configFields: '{}',
    outputFields: '{"review_result": "boolean", "comments": "string"}',
    version: "V1.0.0",
    changelog: "初始版本",
    status: "正常",
    creator: "系统",
    createTime: "2026-08-13",
    retryCount: 3,
    retryLogic: "FIXED",
    retryDelay: 10,
    timeout: 3600,
    responseTimeout: 600,
    timeoutPolicy: "TIME_OUT_WF"
  }
];

const nodeConfigsSchema = {
  '歌词生成配置': {
    configFields: [
      { key: 'system_prompt', label: '系统提示词', type: 'string', inputType: 'textarea', placeholder: '系统提示词...' },
      { key: 'user_prompt', label: '用户提示词', type: 'string', inputType: 'textarea', placeholder: '用户提示词...' }
    ],
    extraFields: [
      { key: 'workflow', label: '工作流', type: 'string', placeholder: '工作流标识...' },
      { key: 'workflow_type', label: '工作流类型', type: 'string', placeholder: '工作流类型...' },
      { key: 'distinguish_field', label: '区分字段', type: 'string', placeholder: '区分字段...' },
      { key: 'distinguish_value', label: '区分字段值', type: 'string', placeholder: '区分字段值...' },
      { key: 'model', label: '模型', type: 'string', placeholder: '模型版本...' }
    ],
    data: [
      { 
        id: 1, 
        configName: '歌词生成配置',
        nodeName: '歌词生成',
        nodeVersion: 'V1.0.0',
        executionMode: '机器',
        style: '80金曲',
        system_prompt: `# 角色：非主流向中文歌词创作专员\\n专注于为20-35岁城乡听众创作贴合其情感的非主流中文歌词，擅长把握青年生活语境与韵律表达。`, 
        user_prompt: '基于目标歌词的基础风格，改写成主题内容以《爱人错过》进行延展的歌词。', 
        workflow: '工作流1', 
        workflow_type: '直出', 
        distinguish_field: '年龄风格', 
        distinguish_value: '青年', 
        model: 'gpt-4o', 
        remark: '歌词生成的默认基础配置',
        status: '启用', 
        creator: '系统', 
        createTime: '2026-05-18' 
      }
    ]
  },
  '提示词获取': {
    configFields: [
      { key: 'prompt', label: '提示词（style 内容）', type: 'string', inputType: 'textarea', placeholder: '填写提示词 style 内容...' },
      { key: 'workflow', label: '生成方式', type: 'select', options: ['inspo', 'cover', 'sample', 'prompt'], placeholder: '请选择生成方式' },
      { key: 'cover_audio', label: 'cover音频', type: 'string', placeholder: '音频URL...' },
      { key: 'inspo_audio', label: 'inspo音频', type: 'string', placeholder: '音频URL...' },
      { key: 'sample_audio', label: 'sample音频', type: 'string', placeholder: '音频URL...' },
      { key: 'clip_ids', label: 'clip_ids', type: 'string', placeholder: '请输入 clip_ids' },
      { key: 'audio_url', label: '音频链接', type: 'string', placeholder: '请输入音频链接' },
      { key: 'version', label: '使用版本', type: 'string', placeholder: 'v3.5...' }
    ],
    extraFields: [
      { key: 'text', label: '文本', type: 'string', placeholder: '文本...' },
      { key: 'singer', label: '歌手', type: 'string', placeholder: '歌手...' },
      { key: 'voice_features', label: '音色特点', type: 'string', placeholder: '特点...' },
      { key: 'lyrics_word_count', label: '歌词字数参考', type: 'string', placeholder: '字数...' },
      { key: 'voice_example', label: '音色示例', type: 'string', placeholder: '示例...' },
      { key: 'style_example', label: '风格示例', type: 'string', placeholder: '示例...' },
      { key: 'influence_param', label: 'Influence 参数', type: 'string', placeholder: '参数...' }
    ],
    data: [
      {
        id: 1,
        configName: '提示词获取',
        nodeName: '提示词选择',
        nodeVersion: 'V1.0.0',
        executionMode: '机器',
        model: '5.5',
        prompt: '',
        workflow: 'inspo',
        style: '年轻下沉',
        cover_audio: '若云汀 测试 (1).wav,若云汀 测试.wav',
        inspo_audio: '思念的风景.wav,一滴泪的海洋.wav,泪在风中淌.wav',
        sample_audio: '',
        clip_ids: '',
        audio_url: '',
        version: '5.0',
        text: '年轻下沉',
        singer: '欣瑶-女，赵雷-男',
        gender: '女，男',
        voice_features: '年轻甜美',
        lyrics_word_count: '测试中用到的是8个字',
        voice_example: '甜美女声，音色清亮',
        style_example: '',
        influence_param: 'audio 45',
        remark: '默认suno跑歌配置',
        status: '启用',
        creator: '系统',
        createTime: '2026-05-18'
      }
    ]
  },
  '音频制作': {
    configFields: [
      { key: 'prompt', label: '提示词（style 内容）', type: 'string', inputType: 'textarea', placeholder: '填写提示词 style 内容...' },
      { key: 'workflow', label: '生成方式', type: 'select', options: ['inspo', 'cover', 'sample', 'prompt'], placeholder: '请选择生成方式' },
      { key: 'cover_audio', label: 'cover音频', type: 'string', placeholder: '音频URL...' },
      { key: 'inspo_audio', label: 'inspo音频', type: 'string', placeholder: '音频URL...' },
      { key: 'sample_audio', label: 'sample音频', type: 'string', placeholder: '音频URL...' },
      { key: 'version', label: '使用版本', type: 'string', placeholder: 'v3.5...' }
    ],
    extraFields: [
      { key: 'text', label: '文本', type: 'string', placeholder: '文本...' },
      { key: 'singer', label: '歌手', type: 'string', placeholder: '歌手...' },
      { key: 'voice_features', label: '音色特点', type: 'string', placeholder: '特点...' },
      { key: 'lyrics_word_count', label: '歌词字数参考', type: 'string', placeholder: '字数...' },
      { key: 'influence_param', label: 'influence参数', type: 'string', placeholder: '参数...' },
      { key: 'voice_example', label: '音色示例', type: 'string', placeholder: '示例...' },
      { key: 'style_example', label: '风格示例', type: 'string', placeholder: '示例...' }
    ],
    data: [
      {
        id: 1,
        configName: '音频制作',
        nodeName: 'suno 生成',
        nodeVersion: 'V1.0.0',
        executionMode: '机器',
        model: '5.5',
        prompt: '',
        workflow: 'audio-production',
        style: '默认',
        cover_audio: '',
        inspo_audio: '',
        sample_audio: '',
        version: '5.0',
        text: '音频制作',
        singer: '',
        gender: '',
        voice_features: '',
        lyrics_word_count: '',
        voice_example: '',
        style_example: '',
        influence_param: 'audio 45',
        remark: '音频制作默认配置',
        status: '启用',
        creator: '系统',
        createTime: '2026-05-18'
      }
    ]
  }
};

let currentNodeConfigTab = '歌词生成配置';
let editingNodeTypeId = null;
let editingNodeConfigId = null;

// ==========================================
// 节点管理逻辑
// ==========================================

function escapeAttr(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function ensureNodeSpecTooltip() {
    let tooltip = document.getElementById('nodeSpecTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'nodeSpecTooltip';
        tooltip.className = 'node-spec-tooltip';
        document.body.appendChild(tooltip);
    }
    return tooltip;
}

function showNodeSpecTooltip(event, text) {
    const tooltip = ensureNodeSpecTooltip();
    tooltip.textContent = text || '';
    tooltip.style.display = text ? 'block' : 'none';
    moveNodeSpecTooltip(event);
}

function moveNodeSpecTooltip(event) {
    const tooltip = document.getElementById('nodeSpecTooltip');
    if (!tooltip || tooltip.style.display === 'none') return;
    const offset = 14;
    const maxLeft = window.innerWidth - tooltip.offsetWidth - 12;
    const maxTop = window.innerHeight - tooltip.offsetHeight - 12;
    tooltip.style.left = Math.max(12, Math.min(event.clientX + offset, maxLeft)) + 'px';
    tooltip.style.top = Math.max(12, Math.min(event.clientY + offset, maxTop)) + 'px';
}

function hideNodeSpecTooltip() {
    const tooltip = document.getElementById('nodeSpecTooltip');
    if (tooltip) tooltip.style.display = 'none';
}

function renderNodeTypesTable(data = nodeTypesData) {
    const tbody = document.getElementById('nodeTypesTableBody');
    const empty = document.getElementById('nodeTypesEmptyState');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        if (empty) empty.style.display = 'flex';
        return;
    }
    if (empty) empty.style.display = 'none';

    data.forEach(item => {
        const isNormal = item.status === '正常';
        const statusBadge = isNormal 
            ? `<span class="badge" style="background: #E6FFED; color: #52C41A; border: 1px solid #B7EB8F;">正常</span>`
            : `<span class="badge" style="background: #FFF2F0; color: #FF4D4F; border: 1px solid #FFCCC7;">已禁用</span>`;

        const attrBadge = item.typeAttr === '人工节点'
            ? `<span class="badge" style="background: #E6F4FF; color: #1677FF; border: 1px solid #91CAFF;">人工节点</span>`
            : `<span class="badge" style="background: #F9F0FF; color: #722ED1; border: 1px solid #D3ADF7;">机器节点</span>`;
        const configuredText = item.isConfigured || '否';
        const configuredBadge = configuredText === '是'
            ? `<span class="badge" style="background: #E6FFED; color: #52C41A; border: 1px solid #B7EB8F;">是</span>`
            : `<span class="badge" style="background: #F5F5F5; color: var(--gray-600); border: 1px solid var(--gray-300);">否</span>`;
        const inputFieldsText = escapeAttr(item.inputFields);
        const configFieldsText = escapeAttr(item.configFields);
        const outputFieldsText = escapeAttr(item.outputFields);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: var(--gray-600);">${item.id}</td>
            <td style="font-weight: 500;">${item.typeName}</td>
            <td style="color: var(--gray-600);">${item.nodeType || '词'}</td>
            <td class="node-type-nowrap-cell">${attrBadge}</td>
            <td class="node-type-nowrap-cell">${configuredBadge}</td>
            <td class="node-type-spec-cell" data-tooltip="${inputFieldsText}" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()">${inputFieldsText}</td>
            <td class="node-type-spec-cell" data-tooltip="${configFieldsText}" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()">${configFieldsText}</td>
            <td class="node-type-spec-cell" data-tooltip="${outputFieldsText}" onmouseenter="showNodeSpecTooltip(event, this.dataset.tooltip)" onmousemove="moveNodeSpecTooltip(event)" onmouseleave="hideNodeSpecTooltip()">${outputFieldsText}</td>
            <td style="color: var(--gray-600);">${item.version}</td>
            <td style="color: var(--gray-600); font-size: 13px;" title="${item.changelog}">${item.changelog}</td>
            <td class="node-type-nowrap-cell">${statusBadge}</td>
            <td>${item.creator}</td>
            <td style="color: var(--gray-600);">${item.createTime}</td>
            <td style="color: var(--gray-600);">${item.retryCount}</td>
            <td style="color: var(--gray-600);">${item.retryLogic}</td>
            <td style="color: var(--gray-600);">${item.retryDelay}s</td>
            <td style="color: var(--gray-600);">${item.timeout}s</td>
            <td style="color: var(--gray-600);">${item.responseTimeout}s</td>
            <td style="color: var(--gray-600);">${item.timeoutPolicy}</td>
            <td class="sticky-right">
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="btn-text" onclick="openNodeTypeDrawer('edit', '${item.id}')">详情</button>
                    <button class="btn-text danger" onclick="toggleDisableNodeType('${item.id}')" style="color: ${isNormal ? 'var(--danger)' : 'var(--success)'};">${isNormal ? '禁用' : '启用'}</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function doNodeTypesSearch() {
    const loader = document.getElementById('nodeTypesTableLoading');
    if (loader) loader.style.display = 'flex';

    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        
        const typeNameVal = (document.getElementById('nodeTypesSearchName').value || '').trim().toLowerCase();
        const typeAttrVal = document.getElementById('nodeTypesSearchType').value;
        const statusVal = document.getElementById('nodeTypesSearchStatus').value;

        const filtered = nodeTypesData.filter(item => {
            const matchesName = !typeNameVal || item.typeName.toLowerCase().includes(typeNameVal);
            const matchesAttr = !typeAttrVal || item.typeAttr === typeAttrVal;
            const matchesStatus = !statusVal || item.status === statusVal;
            return matchesName && matchesAttr && matchesStatus;
        });

        renderNodeTypesTable(filtered);
    }, 300);
}

function resetNodeTypesSearch() {
    document.getElementById('nodeTypesSearchName').value = '';
    document.getElementById('nodeTypesSearchType').value = '';
    document.getElementById('nodeTypesSearchStatus').value = '';
    renderNodeTypesTable();
}

function openNodeTypeDrawer(mode, id = null) {
    editingNodeTypeId = id;
    const title = document.getElementById('nodeTypeDrawerTitle');
    const btn = document.getElementById('btnNodeTypeSubmit');

    const overlay = document.getElementById('nodeTypeDrawerOverlay');
    const drawer = document.getElementById('nodeTypeDrawer');
    if (!overlay || !drawer) return;
    
    if (mode === 'add') {
        title.innerText = '新增节点';
        btn.innerText = '确认新增';
        
        document.getElementById('inputNodeType_typeName').value = '';
        document.getElementById('inputNodeType_nodeType').value = '词';
        document.getElementById('inputNodeType_typeAttr').value = '人工节点';
        document.getElementById('inputNodeType_status').value = '正常';
        document.getElementById('inputNodeType_version').value = 'V1.0.0';
        document.getElementById('inputNodeType_inputFields').value = '';
        document.getElementById('inputNodeType_configFields').value = '';
        document.getElementById('inputNodeType_outputFields').value = '';
        document.getElementById('inputNodeType_changelog').value = '';
        document.getElementById('inputNodeType_retryCount').value = '3';
        document.getElementById('inputNodeType_retryLogic').value = 'FIXED';
        document.getElementById('inputNodeType_retryDelay').value = '10';
        document.getElementById('inputNodeType_timeout').value = '3600';
        document.getElementById('inputNodeType_responseTimeout').value = '600';
        document.getElementById('inputNodeType_timeoutPolicy').value = 'TIME_OUT_WF';
        document.getElementById('inputNodeType_creator').value = '';
        document.getElementById('inputNodeType_createTime').value = new Date().toISOString().slice(0, 10);
    } else {
        title.innerText = '节点详情';
        btn.innerText = '保存修改';
        
        const item = nodeTypesData.find(n => n.id === id);
        if (item) {
            document.getElementById('inputNodeType_typeName').value = item.typeName;
            document.getElementById('inputNodeType_nodeType').value = item.nodeType || '词';
            document.getElementById('inputNodeType_typeAttr').value = item.typeAttr;
            document.getElementById('inputNodeType_status').value = item.status;
            document.getElementById('inputNodeType_version').value = item.version;
            document.getElementById('inputNodeType_inputFields').value = item.inputFields;
            document.getElementById('inputNodeType_configFields').value = item.configFields;
            document.getElementById('inputNodeType_outputFields').value = item.outputFields;
            document.getElementById('inputNodeType_changelog').value = item.changelog;
            document.getElementById('inputNodeType_retryCount').value = item.retryCount;
            document.getElementById('inputNodeType_retryLogic').value = item.retryLogic;
            document.getElementById('inputNodeType_retryDelay').value = item.retryDelay;
            document.getElementById('inputNodeType_timeout').value = item.timeout;
            document.getElementById('inputNodeType_responseTimeout').value = item.responseTimeout;
            document.getElementById('inputNodeType_timeoutPolicy').value = item.timeoutPolicy;
            document.getElementById('inputNodeType_creator').value = item.creator;
            document.getElementById('inputNodeType_createTime').value = item.createTime;
        }
    }

    overlay.style.display = 'block';
    setTimeout(() => {
        drawer.classList.add('active');
    }, 10);
}

function closeNodeTypeDrawer() {
    const overlay = document.getElementById('nodeTypeDrawerOverlay');
    const drawer = document.getElementById('nodeTypeDrawer');
    if (!overlay || !drawer) return;
    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function saveNodeTypeDrawer() {
    const typeName = (document.getElementById('inputNodeType_typeName').value || '').trim();
    const changelog = (document.getElementById('inputNodeType_changelog').value || '').trim();
    
    if (!typeName || !changelog) {
        alert('节点名称和变更日志为必填项！');
        return;
    }

    const nodeType = document.getElementById('inputNodeType_nodeType').value;
    const typeAttr = document.getElementById('inputNodeType_typeAttr').value;
    const status = document.getElementById('inputNodeType_status').value;
    const version = document.getElementById('inputNodeType_version').value || 'V1.0.0';
    const inputFields = document.getElementById('inputNodeType_inputFields').value || '{}';
    const configFields = document.getElementById('inputNodeType_configFields').value || '{}';
    const outputFields = document.getElementById('inputNodeType_outputFields').value || '{}';
    const retryCount = parseInt(document.getElementById('inputNodeType_retryCount').value) || 3;
    const retryLogic = document.getElementById('inputNodeType_retryLogic').value;
    const retryDelay = parseInt(document.getElementById('inputNodeType_retryDelay').value) || 10;
    const timeout = parseInt(document.getElementById('inputNodeType_timeout').value) || 3600;
    const responseTimeout = parseInt(document.getElementById('inputNodeType_responseTimeout').value) || 600;
    const timeoutPolicy = document.getElementById('inputNodeType_timeoutPolicy').value;
    const creator = document.getElementById('inputNodeType_creator').value || '未知';
    const createTime = document.getElementById('inputNodeType_createTime').value;

    if (editingNodeTypeId) {
        // Edit
        const item = nodeTypesData.find(n => n.id === editingNodeTypeId);
        if (item) {
            item.typeName = typeName;
            item.nodeType = nodeType;
            item.typeAttr = typeAttr;
            item.status = status;
            item.version = version;
            item.inputFields = inputFields;
            item.configFields = configFields;
            item.outputFields = outputFields;
            item.changelog = changelog;
            item.retryCount = retryCount;
            item.retryLogic = retryLogic;
            item.retryDelay = retryDelay;
            item.timeout = timeout;
            item.responseTimeout = responseTimeout;
            item.timeoutPolicy = timeoutPolicy;
            item.creator = creator;
        }
    } else {
        // Add
        const maxId = Math.max(...nodeTypesData.map(n => parseInt(n.id)));
        const newId = String(maxId + 1);
        nodeTypesData.push({
            id: newId,
            typeName,
            nodeType,
            typeAttr,
            isConfigured: '否',
            inputFields,
            configFields,
            outputFields,
            version,
            changelog,
            status,
            creator,
            createTime,
            retryCount,
            retryLogic,
            retryDelay,
            timeout,
            responseTimeout,
            timeoutPolicy
        });
    }

    renderNodeTypesTable();
    closeNodeTypeDrawer();
}

function toggleDisableNodeType(id) {
    const item = nodeTypesData.find(n => n.id === id);
    if (!item) return;

    if (item.status === '正常') {
        openConfirmDialog(
            '禁用确认',
            `确认禁用节点 "${item.typeName}" 吗？禁用后将无法在流水线编排中引用此节点。`,
            '确认禁用',
            true,
            () => {
                item.status = '已禁用';
                renderNodeTypesTable();
            }
        );
    } else {
        openConfirmDialog(
            '启用确认',
            `确认重新启用节点 "${item.typeName}" 吗？`,
            '确认启用',
            false,
            () => {
                item.status = '正常';
                renderNodeTypesTable();
            }
        );
    }
}

function openNodeTypeExportModal() {
    const select = document.getElementById('exportNodeTypeSelect');
    if (select) {
        select.innerHTML = '<option value="all">全部节点</option>';
        nodeTypesData.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.typeName;
            opt.innerText = item.typeName;
            select.appendChild(opt);
        });
    }
    
    const modal = document.getElementById('nodeTypeExportModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    updateNodeTypeExportCount();
}

function closeNodeTypeExportModal() {
    const modal = document.getElementById('nodeTypeExportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateNodeTypeExportCount() {
    const val = document.getElementById('exportNodeTypeSelect').value;
    let count = 0;
    if (val === 'all') {
        count = nodeTypesData.length;
    } else {
        count = nodeTypesData.filter(item => item.typeName === val).length;
    }
    document.getElementById('exportNodeTypeCount').innerText = count;
}

function confirmNodeTypeExport() {
    const selected = document.getElementById('exportNodeTypeSelect').value;
    const rows = [['ID', '节点名称', '生产环节', '节点属性', '是否配置', '版本', '输入字段', '配置字段', '输出字段', '变更日志', '状态', '创建人', '创建时间', '重试次数', '重试逻辑', '重试间隔', '超时时间', '响应超时', '超时策略']];
    
    nodeTypesData.forEach(item => {
        if (selected === 'all' || selected === item.typeName) {
            rows.push([
                item.id,
                item.typeName,
                item.nodeType || '作词',
                item.typeAttr,
                item.isConfigured || '否',
                item.version,
                item.inputFields.replace(/\n/g, ' '),
                item.configFields.replace(/\n/g, ' '),
                item.outputFields.replace(/\n/g, ' '),
                item.changelog,
                item.status,
                item.creator,
                item.createTime,
                item.retryCount,
                item.retryLogic,
                item.retryDelay,
                item.timeout,
                item.responseTimeout,
                item.timeoutPolicy
            ]);
        }
    });

    const csv = '\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selected === 'all' ? '全部节点导出.csv' : `${selected}节点导出.csv`;
    a.click();
    URL.revokeObjectURL(url);
    closeNodeTypeExportModal();
}

// ==========================================
// 节点配置库逻辑
// ==========================================

function getDefaultNodeConfigNodeName(tabName) {
    const map = {
        '歌词生成配置': '歌词生成',
        '提示词获取': '提示词选择',
        '音频制作': 'suno 生成'
    };
    return map[tabName] || tabName;
}

function getDefaultNodeConfigVersion(tabName) {
    const map = {
        '歌词生成配置': 'V1.0.0',
        '提示词获取': 'V1.0.0',
        '音频制作': 'V1.0.0'
    };
    return map[tabName] || 'V1.0.0';
}

function getDefaultNodeConfigExecutionMode(tabName) {
    const map = {
        '歌词生成配置': '机器',
        '提示词获取': '机器',
        '音频制作': '机器'
    };
    return map[tabName] || '机器';
}

function getNodeConfigTabDisplayName(tabName) {
    return tabName === '提示词获取' ? '提示词选择' : tabName;
}

function getNodeConfigNodeDisplayName(tabName, nodeName) {
    if (tabName === '提示词获取' && (!nodeName || nodeName === '写曲提示词获取')) {
        return '提示词选择';
    }
    return nodeName || tabName;
}

function initNodeConfigsPage() {
    const tabsContainer = document.getElementById('nodeConfigTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';
    Object.keys(nodeConfigsSchema).forEach((tab, index) => {
        const item = document.createElement('div');
        item.className = `tab-item${tab === currentNodeConfigTab ? ' active' : ''}`;
        item.style.padding = '12px 0';
        item.style.cursor = 'pointer';
        item.style.borderBottom = tab === currentNodeConfigTab ? '2px solid var(--primary)' : '2px solid transparent';
        item.style.color = tab === currentNodeConfigTab ? 'var(--primary)' : 'var(--gray-600)';
        item.style.fontWeight = tab === currentNodeConfigTab ? '600' : '500';
        item.style.fontSize = '14px';
        item.style.position = 'relative';
        item.style.bottom = '-1px';
        item.dataset.tabName = tab;
        item.innerText = getNodeConfigTabDisplayName(tab);
        item.onclick = () => switchNodeConfigTab(tab);
        tabsContainer.appendChild(item);
    });

    switchNodeConfigTab(currentNodeConfigTab);
}

function switchNodeConfigTab(tabName) {
    currentNodeConfigTab = tabName;
    const tabItems = document.querySelectorAll('#nodeConfigTabs .tab-item');
    tabItems.forEach(el => {
        if (el.dataset.tabName === tabName) {
            el.style.borderBottom = '2px solid var(--primary)';
            el.style.color = 'var(--primary)';
            el.style.fontWeight = '600';
        } else {
            el.style.borderBottom = '2px solid transparent';
            el.style.color = 'var(--gray-600)';
            el.style.fontWeight = '500';
        }
    });

    const titleEl = document.getElementById('nodeConfigTableTitle');
    if (titleEl) titleEl.innerText = `配置列表（${getNodeConfigTabDisplayName(tabName)}）`;

    renderNodeConfigTable();
}

function getNodeConfigInfoFields(tabName, schema) {
    const hiddenBasicKeys = ['workflow_type', 'model'];
    const promptConfigFieldOrder = ['prompt', 'singer', 'workflow', 'voice_features', 'lyrics_word_count', 'influence_param', 'voice_example', 'style_example', 'cover_audio', 'sample_audio', 'inspo_audio'];
    const allConfigFields = [...schema.configFields, ...schema.extraFields];

    if (tabName === '歌词生成配置') {
        return schema.configFields;
    }

    if (tabName === '提示词获取') {
        return promptConfigFieldOrder.map(key => allConfigFields.find(f => f.key === key)).filter(Boolean);
    }

    if (tabName === '音频制作') {
        return [
            ...schema.configFields,
            ...schema.extraFields.filter(f => !hiddenBasicKeys.includes(f.key))
        ];
    }

    return [];
}

function renderNodeConfigTable(data = null) {
    const schema = nodeConfigsSchema[currentNodeConfigTab];
    const head = document.getElementById('nodeConfigTableHead');
    const body = document.getElementById('nodeConfigTableBody');
    const empty = document.getElementById('nodeConfigEmptyState');
    if (!head || !body) return;

    const configInfoFields = getNodeConfigInfoFields(currentNodeConfigTab, schema);
    const useConfigInfoColumns = configInfoFields.length > 0;

    // Calculate dynamic min-width based on column count
    const totalCols = 5 + (useConfigInfoColumns ? configInfoFields.length : schema.configFields.length + schema.extraFields.length) + 5;
    const tableEl = document.getElementById('nodeConfigTable');
    if (tableEl) {
        tableEl.style.minWidth = Math.max(1200, totalCols * 130) + 'px';
    }

    // Header layout
    let headHtml = `
        <tr>
            <th rowspan="2" style="width: 60px; border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200);">ID</th>
            <th rowspan="2" style="border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200);">配置名称</th>
            <th rowspan="2" style="border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200);">节点名称</th>
            <th rowspan="2" style="width: 96px; min-width: 96px; border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); white-space: nowrap;">节点属性</th>
            <th rowspan="2" style="border-right: 1px solid var(--gray-300); border-bottom: 1px solid var(--gray-200);">风格</th>`;
    
    if (useConfigInfoColumns && configInfoFields.length > 0) {
        headHtml += `<th colspan="${configInfoFields.length}" style="text-align: center; border-right: 2px solid var(--primary-light); background: #f0f5ff; color: var(--primary); border-bottom: 1px solid var(--gray-200);">配置信息</th>`;
    } else if (schema.configFields.length > 0) {
        headHtml += `<th colspan="${schema.configFields.length}" style="text-align: center; border-right: 2px solid var(--primary-light); background: #f0f5ff; color: var(--primary); border-bottom: 1px solid var(--gray-200);">配置真值</th>`;
    }
    if (!useConfigInfoColumns && schema.extraFields.length > 0) {
        headHtml += `<th colspan="${schema.extraFields.length}" style="text-align: center; border-right: 2px solid #D3ADF7; background: #f9f0ff; color: #722ed1; border-bottom: 1px solid var(--gray-200);">额外字段</th>`;
    }

    headHtml += `
            <th rowspan="2" style="border-bottom: 1px solid var(--gray-200); border-left: 1px solid var(--gray-200);">备注</th>
            <th rowspan="2" style="border-bottom: 1px solid var(--gray-200);">状态</th>
            <th rowspan="2" style="border-bottom: 1px solid var(--gray-200);">创建人</th>
            <th rowspan="2" style="border-bottom: 1px solid var(--gray-200);">创建时间</th>
            <th rowspan="2" class="sticky-right" style="width: 130px; border-bottom: 1px solid var(--gray-200); text-align: center;">操作</th>
        </tr>
        <tr>`;

    if (useConfigInfoColumns) {
        configInfoFields.forEach((f, idx) => {
            let style = 'border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); background: #f0f5ff; color: var(--primary); font-size: 13px; font-weight: 500;';
            if (idx === configInfoFields.length - 1) style += ' border-right: 2px solid var(--primary-light);';
            else style += ' border-right: 1px solid var(--gray-200);';
            headHtml += `<th style="${style}">${f.label}</th>`;
        });
    } else {
        schema.configFields.forEach((f, idx) => {
            let style = 'border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); background: #f0f5ff; color: var(--primary); font-size: 13px; font-weight: 500;';
            if (idx === schema.configFields.length - 1) style += ' border-right: 2px solid var(--primary-light);';
            else style += ' border-right: 1px solid var(--gray-200);';
            headHtml += `<th style="${style}">${f.label}</th>`;
        });
        schema.extraFields.forEach((f, idx) => {
            let style = 'border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); background: #f9f0ff; color: #722ed1; font-size: 13px; font-weight: 500;';
            if (idx === schema.extraFields.length - 1) style += ' border-right: 2px solid #D3ADF7;';
            else style += ' border-right: 1px solid var(--gray-200);';
            headHtml += `<th style="${style}">${f.label}</th>`;
        });
    }
    headHtml += `</tr>`;
    head.innerHTML = headHtml;

    const listData = data !== null ? data : schema.data;
    body.innerHTML = '';

    if (listData.length === 0) {
        if (empty) empty.style.display = 'flex';
        return;
    }
    if (empty) empty.style.display = 'none';

    listData.forEach(row => {
        const rowStatus = row.status === '正常' ? '启用' : (row.status === '已禁用' ? '禁用' : (row.status || '启用'));
        const isNormal = rowStatus !== '禁用';
        const statusBadge = isNormal 
            ? `<span class="badge" style="background: #E6FFED; color: #52C41A; border: 1px solid #B7EB8F;">启用</span>`
            : `<span class="badge" style="background: #FFF2F0; color: #FF4D4F; border: 1px solid #FFCCC7;">禁用</span>`;

        let trHtml = `
            <td style="color: var(--gray-600); border-right: 1px solid var(--gray-200);">${row.id}</td>
            <td style="color: var(--gray-800); font-weight: 500; border-right: 1px solid var(--gray-200);">${row.configName || currentNodeConfigTab}</td>
            <td style="color: var(--gray-600); border-right: 1px solid var(--gray-200);">${getNodeConfigNodeDisplayName(currentNodeConfigTab, row.nodeName)}</td>
            <td style="width: 96px; min-width: 96px; border-right: 1px solid var(--gray-200); white-space: nowrap;"><span class="badge" style="background: #F9F0FF; color: #722ED1; border: 1px solid #D3ADF7; white-space: nowrap;">机器节点</span></td>
            <td style="color: var(--gray-600); border-right: 1px solid var(--gray-300);">${row.style || '默认'}</td>`;

        if (useConfigInfoColumns) {
            configInfoFields.forEach((f, idx) => {
                let styleVal = 'font-family: monospace; color: var(--gray-600); white-space: nowrap;';
                if (idx === configInfoFields.length - 1) styleVal += ' border-right: 2px solid var(--primary-light);';
                else styleVal += ' border-right: 1px solid var(--gray-200);';
                const cellVal = row[f.key] || '';
                trHtml += `<td style="${styleVal}" title='${cellVal.replace(/'/g, "&apos;")}' onclick="alert('${f.label}:\\n' + this.title)">${cellVal}</td>`;
            });
        } else {
            schema.configFields.forEach((f, idx) => {
                let styleVal = 'font-family: monospace; color: var(--gray-600); white-space: nowrap;';
                if (idx === schema.configFields.length - 1) styleVal += ' border-right: 2px solid var(--primary-light);';
                else styleVal += ' border-right: 1px solid var(--gray-200);';
                const cellVal = row[f.key] || '';
                trHtml += `<td style="${styleVal}" title='${cellVal.replace(/'/g, "&apos;")}' onclick="alert('${f.label}:\\n' + this.title)">${cellVal}</td>`;
            });
            schema.extraFields.forEach((f, idx) => {
                let styleVal = 'font-family: monospace; color: var(--gray-600); white-space: nowrap;';
                if (idx === schema.extraFields.length - 1) styleVal += ' border-right: 2px solid #D3ADF7;';
                else styleVal += ' border-right: 1px solid var(--gray-200);';
                const cellVal = row[f.key] || '';
                trHtml += `<td style="${styleVal}" title='${cellVal.replace(/'/g, "&apos;")}' onclick="alert('${f.label}:\\n' + this.title)">${cellVal}</td>`;
            });
        }

        trHtml += `
            <td style="color: var(--gray-600); border-left: 1px solid var(--gray-200); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${row.remark || ''}">${row.remark || '-'}</td>
            <td>${statusBadge}</td>
            <td>${row.creator}</td>
            <td style="color: var(--gray-600);">${row.createTime}</td>
            <td class="sticky-right">
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="btn-text" onclick="openNodeConfigDrawer('edit', '${row.id}')">详情</button>
                    <button class="btn-text danger" onclick="toggleDisableNodeConfig('${row.id}')" style="color: ${isNormal ? 'var(--danger)' : 'var(--success)'};">${isNormal ? '禁用' : '启用'}</button>
                </div>
            </td>`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = trHtml;
        body.appendChild(tr);
    });
}

function doNodeConfigSearch() {
    const loader = document.getElementById('nodeConfigTableLoading');
    if (loader) loader.style.display = 'flex';

    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        
        const styleVal = (document.getElementById('nodeConfigSearchStyle').value || '').trim().toLowerCase();
        const statusVal = document.getElementById('nodeConfigSearchStatus').value;
        const creatorVal = (document.getElementById('nodeConfigSearchCreator').value || '').trim().toLowerCase();

        const schema = nodeConfigsSchema[currentNodeConfigTab];
        const filtered = schema.data.filter(row => {
            const matchesStyle = !styleVal || (row.style || '').toLowerCase().includes(styleVal);
            const rowStatus = row.status === '正常' ? '启用' : (row.status === '已禁用' ? '禁用' : row.status);
            const matchesStatus = !statusVal || rowStatus === statusVal;
            const matchesCreator = !creatorVal || row.creator.toLowerCase().includes(creatorVal);
            return matchesStyle && matchesStatus && matchesCreator;
        });

        renderNodeConfigTable(filtered);
    }, 300);
}

function resetNodeConfigSearch() {
    document.getElementById('nodeConfigSearchStyle').value = '';
    document.getElementById('nodeConfigSearchStatus').value = '';
    document.getElementById('nodeConfigSearchCreator').value = '';
    renderNodeConfigTable();
}

function getCurrentLoginUserName() {
    const explicitUser = document.querySelector('[data-current-user]');
    const visibleUser = explicitUser ? explicitUser.getAttribute('data-current-user') || explicitUser.textContent : '';
    return (visibleUser || '').trim() || '张三';
}

function formatDateTimeToSecond(date = new Date()) {
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getNodeConfigMultiValueList(value) {
    if (Array.isArray(value)) return value;
    return String(value || '')
        .split(/[、,，]/)
        .map(item => item.trim())
        .filter(Boolean);
}

function setNodeConfigDynamicInputValue(input, value) {
    if (input.classList.contains('node-config-singer-value')) {
        input.value = value || '';
        renderNodeConfigSingerMulti(input.closest('.node-config-singer-select'));
        return;
    }
    if (input.multiple) {
        const values = getNodeConfigMultiValueList(value);
        Array.from(input.options).forEach(option => {
            option.selected = values.includes(option.value);
        });
        return;
    }
    input.value = value || '';
    if (input.classList.contains('node-config-file-value')) {
        updateNodeConfigFileDisplay(input);
    }
}

function getNodeConfigDynamicInputValue(input) {
    if (input.classList.contains('node-config-singer-value')) {
        return input.value || '';
    }
    if (input.multiple) {
        return Array.from(input.selectedOptions)
            .map(option => option.value)
            .filter(Boolean)
            .join('、');
    }
    return input.value || '';
}

function updateNodeConfigFileDisplay(input) {
    const wrap = input.closest('.node-config-upload-field');
    const listEl = wrap ? wrap.querySelector('.node-config-file-list') : null;
    if (listEl) {
        const files = getNodeConfigMultiValueList(input.value);
        listEl.innerHTML = files.map(fileName => `
            <div class="node-config-file-item">
                <span class="node-config-file-icon"><i class="fas fa-music"></i></span>
                <span class="node-config-file-name">${fileName}</span>
                <button type="button" class="node-config-file-delete" onclick="removeNodeConfigUploadedFile(this, '${fileName.replace(/'/g, "\\'")}')">删除</button>
            </div>
        `).join('');
        listEl.style.display = files.length ? 'flex' : 'none';
    }
}

function handleNodeConfigFileUpload(fileInput) {
    const wrap = fileInput.closest('.node-config-upload-field');
    const valueInput = wrap ? wrap.querySelector('.node-config-file-value') : null;
    if (!valueInput) return;

    const allowMultiple = fileInput.hasAttribute('multiple');
    const files = Array.from(fileInput.files || []).map(file => file.name);
    valueInput.value = allowMultiple ? files.join('、') : (files[0] || '');
    updateNodeConfigFileDisplay(valueInput);
}

function removeNodeConfigUploadedFile(button, fileName) {
    const wrap = button.closest('.node-config-upload-field');
    const valueInput = wrap ? wrap.querySelector('.node-config-file-value') : null;
    if (!valueInput) return;
    const files = getNodeConfigMultiValueList(valueInput.value).filter(item => item !== fileName);
    valueInput.value = files.join('、');
    updateNodeConfigFileDisplay(valueInput);
}

function handleNodeConfigWorkflowChange(select) {
    const wrap = select.closest('.node-config-workflow-field');
    if (!wrap) return;
    let hasAudioUpload = false;
    wrap.querySelectorAll('.node-config-workflow-audio').forEach(item => {
        const isActive = item.getAttribute('data-workflow-audio') === select.value;
        item.style.display = isActive ? 'block' : 'none';
        hasAudioUpload = hasAudioUpload || isActive;
    });
    const audioMetaFields = wrap.querySelector('.node-config-audio-meta-fields');
    if (audioMetaFields) {
        audioMetaFields.style.display = hasAudioUpload ? 'grid' : 'none';
        if (!hasAudioUpload) {
            audioMetaFields.querySelectorAll('.dynamic-config-val').forEach(input => {
                input.value = '';
            });
        }
    }
}

function toggleNodeConfigSingerDropdown(button) {
    const select = button.closest('.node-config-singer-select');
    if (!select) return;
    const menu = select.querySelector('.node-config-singer-dropdown');
    const isOpen = select.classList.toggle('open');
    if (menu) menu.style.display = isOpen ? 'block' : 'none';
}

function toggleNodeConfigSingerOption(optionEl) {
    const select = optionEl.closest('.node-config-singer-select');
    const valueInput = select ? select.querySelector('.node-config-singer-value') : null;
    if (!select || !valueInput) return;

    const value = optionEl.getAttribute('data-value');
    const values = getNodeConfigMultiValueList(valueInput.value);
    if (values.includes(value)) {
        valueInput.value = values.filter(item => item !== value).join('、');
    } else {
        valueInput.value = [...values, value].join('、');
    }
    renderNodeConfigSingerMulti(select);
}

function removeNodeConfigSingerTag(button, value) {
    const select = button.closest('.node-config-singer-select');
    const valueInput = select ? select.querySelector('.node-config-singer-value') : null;
    if (!select || !valueInput) return;

    valueInput.value = getNodeConfigMultiValueList(valueInput.value)
        .filter(item => item !== value)
        .join('、');
    renderNodeConfigSingerMulti(select);
}

function renderNodeConfigSingerMulti(select) {
    if (!select) return;
    const valueInput = select.querySelector('.node-config-singer-value');
    const tagsEl = select.querySelector('.node-config-singer-tags');
    const options = select.querySelectorAll('.node-config-singer-option');
    const values = getNodeConfigMultiValueList(valueInput ? valueInput.value : '');

    if (tagsEl) {
        tagsEl.innerHTML = values.map(value => `
            <span class="node-config-singer-tag">
                ${value}
                <button type="button" onclick="event.stopPropagation(); removeNodeConfigSingerTag(this, '${value.replace(/'/g, "\\'")}')">×</button>
            </span>
        `).join('');
    }

    options.forEach(option => {
        const active = values.includes(option.getAttribute('data-value'));
        option.classList.toggle('selected', active);
        const check = option.querySelector('.node-config-singer-check');
        if (check) check.style.visibility = active ? 'visible' : 'hidden';
    });
}

function openNodeConfigDrawer(mode, id = null) {
    editingNodeConfigId = id;
    const title = document.getElementById('nodeConfigDrawerTitle');
    const btn = document.getElementById('btnNodeConfigSubmit');
    const schema = nodeConfigsSchema[currentNodeConfigTab];
    const dynamicArea = document.getElementById('nodeConfig_dynamicArea');

    const overlay = document.getElementById('nodeConfigDrawerOverlay');
    const drawer = document.getElementById('nodeConfigDrawer');
    if (!overlay || !drawer) return;

    document.getElementById('inputNodeConfig_nodeName').value = getDefaultNodeConfigNodeName(currentNodeConfigTab);
    document.getElementById('inputNodeConfig_nodeVersion').value = getDefaultNodeConfigVersion(currentNodeConfigTab);
    document.getElementById('inputNodeConfig_executionMode').value = getDefaultNodeConfigExecutionMode(currentNodeConfigTab);

    const isLyricConfigTab = currentNodeConfigTab === '歌词生成配置';
    const isPromptConfigTab = currentNodeConfigTab === '提示词获取';
    const isAudioConfigTab = currentNodeConfigTab === '音频制作';
    const configNameFieldHtml = `<input type="text" class="input" id="inputNodeConfig_configName" placeholder="请输入配置名称">`;
    const promptStyleOptions = [
        '年轻下沉',
        '中年下沉',
        '中青下沉',
        '草原风',
        '川民风',
        '新金曲',
        '古早网络风',
        '经典流行',
        '80金曲',
        '8090怀旧',
        '古风',
        '老年下沉',
        '年轻网易风',
        '中年苦情',
        '老年苦情',
        '广场舞DJ',
        '车载DJ'
    ];
    const promptStyleFieldHtml = `<select class="input" id="inputNodeConfig_style">
                <option value="">请选择风格</option>
                ${promptStyleOptions.map(option => `<option>${option}</option>`).join('')}
            </select>`;
    const styleFieldHtml = isLyricConfigTab
        ? `<select class="input" id="inputNodeConfig_style">
                <option>80金曲</option>
                <option>草原风</option>
                <option>潮流摇滚</option>
                <option>国风</option>
                <option>经典摇滚</option>
                <option>老年</option>
                <option>老年下沉</option>
                <option>年轻下沉</option>
                <option>青年</option>
                <option>山歌</option>
                <option>中年</option>
                <option>中年下沉</option>
            </select>`
        : (isPromptConfigTab || isAudioConfigTab
            ? promptStyleFieldHtml
            : `<input type="text" class="input" id="inputNodeConfig_style" placeholder="填写风格...">`);
    const basicVersionFieldHtml = (isPromptConfigTab || isAudioConfigTab)
        ? `<div class="node-type-field">
                    <label>使用版本</label>
                    <input type="text" class="input dynamic-config-val" data-key="version" placeholder="填写使用版本...">
                </div>`
        : '';
    const basicRuntimeFieldHtml = (isPromptConfigTab || isAudioConfigTab)
        ? ''
        : `<div class="node-type-field">
                    <label>工作流类型</label>
                    <input type="text" class="input dynamic-config-val" data-key="workflow_type" placeholder="填写工作流类型...">
                </div>`;
    const basicModelFieldHtml = (isLyricConfigTab || isPromptConfigTab || isAudioConfigTab)
        ? `<div class="node-type-field">
                    <label>模型</label>
                    <input type="text" class="input" id="inputNodeConfig_model" placeholder="填写模型...">
                </div>`
        : '';

    let formHtml = '';
    formHtml += `
        <div class="node-type-form-card">
            <div class="node-type-form-section-title">基础信息</div>
            <div class="node-type-field-grid two">
                <div class="node-type-field">
                    <label>配置名称</label>
                    ${configNameFieldHtml}
                </div>
                <div class="node-type-field">
                    <label>风格</label>
                    ${styleFieldHtml}
                </div>
                ${basicVersionFieldHtml}
                ${basicRuntimeFieldHtml}
                ${basicModelFieldHtml}
                <div class="node-type-field">
                    <label>创建人</label>
                    <input type="text" class="input" id="inputNodeConfig_creator" placeholder="填写创建人">
                </div>
                <div class="node-type-field">
                    <label>创建时间</label>
                    <input type="text" class="input" id="inputNodeConfig_createTime" disabled>
                </div>
                <div class="node-type-field node-type-field-full">
                    <label>备注</label>
                    <textarea class="textarea" id="inputNodeConfig_remark" maxlength="500" style="min-height: 72px;" placeholder="填写备注信息，最多 500 字..."></textarea>
                </div>
            </div>
        </div>`;

    const hiddenBasicKeys = ['workflow_type', 'model'];
    const promptConfigFieldOrder = ['singer', 'voice_features', 'lyrics_word_count', 'influence_param', 'voice_example', 'style_example', 'prompt', 'workflow'];
    const audioConfigFieldOrder = ['singer', 'voice_features', 'lyrics_word_count', 'influence_param', 'voice_example', 'style_example', 'prompt', 'workflow'];
    const allConfigFields = [...schema.configFields, ...schema.extraFields];
    const configInfoFields = currentNodeConfigTab === '歌词生成配置'
        ? schema.configFields
        : (isPromptConfigTab
            ? promptConfigFieldOrder.map(key => allConfigFields.find(f => f.key === key)).filter(Boolean)
            : (isAudioConfigTab
                ? audioConfigFieldOrder.map(key => allConfigFields.find(f => f.key === key)).filter(Boolean)
                : [
                    ...schema.configFields.filter(f => !['cover_audio', 'sample_audio', 'inspo_audio'].includes(f.key)),
                    ...schema.extraFields.filter(f => !hiddenBasicKeys.includes(f.key))
                ]));
    if (configInfoFields.length > 0) {
        const gridClass = currentNodeConfigTab === '歌词生成配置' ? '' : '<div class="node-type-field-grid two">';
        const promptUploadFieldKeys = ['voice_example', 'style_example', 'cover_audio', 'sample_audio', 'inspo_audio'];
        const audioUploadFieldKeys = ['cover_audio', 'sample_audio', 'inspo_audio'];
        formHtml += `<div class="node-type-form-card"><div class="node-type-form-section-title">配置信息</div>${gridClass}`;
        configInfoFields.forEach(f => {
            if ((isPromptConfigTab || isAudioConfigTab) && ['voice_example', 'style_example'].includes(f.key)) {
                formHtml += `
                    <div class="node-type-field">
                        <label>${f.label}</label>
                        <div class="node-config-upload-field">
                            <input type="hidden" class="dynamic-config-val node-config-file-value" data-key="${f.key}">
                            <label class="node-config-upload-zone node-config-upload-zone-compact">
                                <input type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" onchange="handleNodeConfigFileUpload(this)">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span class="node-config-upload-copy">
                                    <span>选择文件</span>
                                    <small>仅支持上传 wav/mp3 格式的音频</small>
                                </span>
                            </label>
                            <div class="node-config-file-list"></div>
                        </div>
                    </div>`;
            } else if ((isPromptConfigTab || isAudioConfigTab) && f.key === 'workflow') {
                const options = (f.options || [])
                    .map(option => `<option value="${option}">${option}</option>`)
                    .join('');
                formHtml += `
                    <div class="node-type-field node-type-field-full node-config-workflow-field">
                        <label>${f.label}</label>
                        <select class="input dynamic-config-val" data-key="${f.key}" onchange="handleNodeConfigWorkflowChange(this)">
                            <option value="">${f.placeholder || '请选择'}</option>${options}
                        </select>
                        <div class="node-config-workflow-audio" data-workflow-audio="inspo" style="display: none; margin-top: 12px;">
                            <label>inspo音频${isPromptConfigTab ? ' <span style="color: var(--danger);">*</span>' : ''}</label>
                            <div class="node-config-upload-field">
                                <input type="hidden" class="dynamic-config-val node-config-file-value" data-key="inspo_audio">
                                <label class="node-config-upload-zone">
                                    <input type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" multiple onchange="handleNodeConfigFileUpload(this)">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span class="node-config-upload-copy">
                                        <span>选择文件</span>
                                        <small>仅支持上传 wav/mp3 格式的音频</small>
                                    </span>
                                </label>
                                <div class="node-config-file-list"></div>
                            </div>
                        </div>
                        <div class="node-config-workflow-audio" data-workflow-audio="cover" style="display: none; margin-top: 12px;">
                            <label>cover音频${isPromptConfigTab ? ' <span style="color: var(--danger);">*</span>' : ''}</label>
                            <div class="node-config-upload-field">
                                <input type="hidden" class="dynamic-config-val node-config-file-value" data-key="cover_audio">
                                <label class="node-config-upload-zone">
                                    <input type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" onchange="handleNodeConfigFileUpload(this)">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span class="node-config-upload-copy">
                                        <span>选择文件</span>
                                        <small>仅支持上传 wav/mp3 格式的音频</small>
                                    </span>
                                </label>
                                <div class="node-config-file-list"></div>
                            </div>
                        </div>
                        <div class="node-config-workflow-audio" data-workflow-audio="sample" style="display: none; margin-top: 12px;">
                            <label>sample音频${isPromptConfigTab ? ' <span style="color: var(--danger);">*</span>' : ''}</label>
                            <div class="node-config-upload-field">
                                <input type="hidden" class="dynamic-config-val node-config-file-value" data-key="sample_audio">
                                <label class="node-config-upload-zone">
                                    <input type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" onchange="handleNodeConfigFileUpload(this)">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span class="node-config-upload-copy">
                                        <span>选择文件</span>
                                        <small>仅支持上传 wav/mp3 格式的音频</small>
                                    </span>
                                </label>
                                <div class="node-config-file-list"></div>
                            </div>
                        </div>
                        ${isPromptConfigTab ? `
                        <div class="node-type-field-grid node-config-audio-meta-fields" style="display: none; margin-top: 12px;">
                            <div class="node-type-field">
                                <label>clip_ids <span style="color: var(--danger);">*</span></label>
                                <input type="text" class="input dynamic-config-val" data-key="clip_ids" placeholder="请输入 clip_ids">
                            </div>
                            <div class="node-type-field">
                                <label>音频链接 <span style="color: var(--danger);">*</span></label>
                                <input type="text" class="input dynamic-config-val" data-key="audio_url" placeholder="请输入音频链接">
                            </div>
                        </div>` : ''}
                    </div>`;
            } else if ((isPromptConfigTab && promptUploadFieldKeys.includes(f.key)) || (isAudioConfigTab && audioUploadFieldKeys.includes(f.key))) {
                return;
            } else if ((isPromptConfigTab || isAudioConfigTab) && f.key === 'singer') {
                const singerOptions = (typeof singersData !== 'undefined' ? singersData : [])
                    .filter(singer => singer.status === '正常')
                    .map(singer => `
                        <div class="node-config-singer-option" data-value="${singer.name}" onclick="toggleNodeConfigSingerOption(this)">
                            <span>${singer.name}-${singer.gender}</span>
                            <i class="fas fa-check node-config-singer-check" style="visibility: hidden;"></i>
                        </div>
                    `)
                    .join('');
                formHtml += `
                    <div class="node-type-field">
                        <label>${f.label}</label>
                        <div class="node-config-singer-select">
                            <input type="hidden" class="dynamic-config-val node-config-singer-value" data-key="${f.key}">
                            <button type="button" class="node-config-singer-trigger" onclick="toggleNodeConfigSingerDropdown(this)">
                                <span class="node-config-singer-tags"></span>
                                <i class="fas fa-chevron-up node-config-singer-arrow"></i>
                            </button>
                            <div class="node-config-singer-dropdown">
                                <div class="node-config-singer-caret"></div>
                                ${singerOptions}
                            </div>
                        </div>
                    </div>`;
            } else if (f.type === 'select') {
                const options = (f.options || [])
                    .map(option => `<option value="${option}">${option}</option>`)
                    .join('');
                formHtml += `<div class="node-type-field"><label>${f.label}</label><select class="input dynamic-config-val" data-key="${f.key}"><option value="">${f.placeholder || '请选择'}</option>${options}</select></div>`;
            } else if (f.inputType === 'textarea') {
                const fieldClass = (isPromptConfigTab || isAudioConfigTab) && f.key === 'prompt' ? 'node-type-field node-type-field-full' : 'node-type-field';
                const textareaStyle = (isPromptConfigTab || isAudioConfigTab) && f.key === 'prompt' ? 'min-height: 160px;' : 'min-height: 120px; font-family: monospace;';
                formHtml += `<div class="${fieldClass}"><label>${f.label}</label><textarea class="textarea dynamic-config-val" data-key="${f.key}" placeholder="${f.placeholder}" style="${textareaStyle}"></textarea></div>`;
            } else {
                formHtml += `<div class="node-type-field"><label>${f.label}</label><input type="text" class="input dynamic-config-val" data-key="${f.key}" placeholder="${f.placeholder}"></div>`;
            }
        });
        formHtml += currentNodeConfigTab === '歌词生成配置' ? `</div>` : `</div></div>`;
    }
    dynamicArea.innerHTML = formHtml;

    if (mode === 'add') {
        title.innerText = '新增配置';
        btn.innerText = '确认新增';
        document.getElementById('inputNodeConfig_configName').value = currentNodeConfigTab;
        document.getElementById('inputNodeConfig_nodeName').value = getDefaultNodeConfigNodeName(currentNodeConfigTab);
        document.getElementById('inputNodeConfig_nodeVersion').value = getDefaultNodeConfigVersion(currentNodeConfigTab);
        document.getElementById('inputNodeConfig_executionMode').value = getDefaultNodeConfigExecutionMode(currentNodeConfigTab);
        document.getElementById('inputNodeConfig_style').value = '';
        document.getElementById('inputNodeConfig_creator').value = getCurrentLoginUserName();
        const basicModelInput = document.getElementById('inputNodeConfig_model');
        if (basicModelInput) basicModelInput.value = isLyricConfigTab ? 'DeepSeek' : '5.5';
        document.getElementById('inputNodeConfig_createTime').value = formatDateTimeToSecond();
        document.getElementById('inputNodeConfig_remark').value = '';
        const versionInput = dynamicArea.querySelector('[data-key="version"]');
        if (versionInput && (isPromptConfigTab || isAudioConfigTab)) versionInput.value = '5.0';
        const workflowTypeInput = dynamicArea.querySelector('[data-key="workflow_type"]');
        if (workflowTypeInput) workflowTypeInput.value = '直出';
        const modelInput = dynamicArea.querySelector('[data-key="model"]');
        if (modelInput) modelInput.value = 'DeepSeek';
        dynamicArea.querySelectorAll('.node-config-singer-select').forEach(renderNodeConfigSingerMulti);
    } else {
        title.innerText = '配置详情';
        btn.innerText = '保存修改';
        const rowData = schema.data.find(d => String(d.id) === String(id));
        if (rowData) {
            document.getElementById('inputNodeConfig_configName').value = rowData.configName || currentNodeConfigTab;
            document.getElementById('inputNodeConfig_nodeName').value = rowData.nodeName || currentNodeConfigTab;
            document.getElementById('inputNodeConfig_nodeVersion').value = rowData.nodeVersion || getDefaultNodeConfigVersion(currentNodeConfigTab);
            document.getElementById('inputNodeConfig_executionMode').value = rowData.executionMode || getDefaultNodeConfigExecutionMode(currentNodeConfigTab);
            document.getElementById('inputNodeConfig_style').value = rowData.style || '';
            document.getElementById('inputNodeConfig_creator').value = rowData.creator;
            const basicModelInput = document.getElementById('inputNodeConfig_model');
            if (basicModelInput) basicModelInput.value = rowData.model || (isLyricConfigTab ? 'DeepSeek' : '5.5');
            document.getElementById('inputNodeConfig_createTime').value = rowData.createTime;
            document.getElementById('inputNodeConfig_remark').value = rowData.remark || '';
            
            // dynamic fields
            const dynInputs = dynamicArea.querySelectorAll('.dynamic-config-val');
            dynInputs.forEach(inp => {
                const key = inp.getAttribute('data-key');
                setNodeConfigDynamicInputValue(inp, rowData[key] || '');
                if (key === 'workflow') {
                    handleNodeConfigWorkflowChange(inp);
                }
            });
        }
    }

    overlay.style.display = 'block';
    setTimeout(() => {
        drawer.classList.add('active');
    }, 10);
}

function closeNodeConfigDrawer() {
    const overlay = document.getElementById('nodeConfigDrawerOverlay');
    const drawer = document.getElementById('nodeConfigDrawer');
    if (!overlay || !drawer) return;
    drawer.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function saveNodeConfigDrawer() {
    const styleVal = (document.getElementById('inputNodeConfig_style').value || '').trim();
    if (!styleVal) {
        alert('风格标识为必填项！');
        return;
    }

    const configNameVal = document.getElementById('inputNodeConfig_configName').value || currentNodeConfigTab;
    const nodeNameVal = document.getElementById('inputNodeConfig_nodeName').value || currentNodeConfigTab;
    const nodeVersionVal = document.getElementById('inputNodeConfig_nodeVersion').value || getDefaultNodeConfigVersion(currentNodeConfigTab);
    const executionModeVal = document.getElementById('inputNodeConfig_executionMode').value || getDefaultNodeConfigExecutionMode(currentNodeConfigTab);
    const schema = nodeConfigsSchema[currentNodeConfigTab];
    const creatorVal = document.getElementById('inputNodeConfig_creator').value || '系统';
    const basicModelInput = document.getElementById('inputNodeConfig_model');
    const modelVal = basicModelInput ? (basicModelInput.value || '5.5') : '';
    const createTimeVal = document.getElementById('inputNodeConfig_createTime').value;
    const remarkVal = document.getElementById('inputNodeConfig_remark').value || '';

    const rowPayload = {};

    const dynInputs = document.querySelectorAll('.dynamic-config-val');
    dynInputs.forEach(inp => {
        const key = inp.getAttribute('data-key');
        rowPayload[key] = getNodeConfigDynamicInputValue(inp);
    });

    if (currentNodeConfigTab === '提示词获取' || currentNodeConfigTab === '音频制作') {
        if (!rowPayload.singer) {
            alert('歌手为必填项！');
            return;
        }
        if (!rowPayload.workflow) {
            alert('生成方式为必填项！');
            return;
        }
        if (currentNodeConfigTab === '提示词获取') {
            const audioFieldByWorkflow = {
                inspo: { key: 'inspo_audio', label: 'inspo音频' },
                cover: { key: 'cover_audio', label: 'cover音频' },
                sample: { key: 'sample_audio', label: 'sample音频' }
            };
            const activeAudioField = audioFieldByWorkflow[rowPayload.workflow];
            if (activeAudioField && !rowPayload[activeAudioField.key]) {
                alert(`${activeAudioField.label}为必填项！`);
                return;
            }
            if (activeAudioField && !(rowPayload.clip_ids || '').trim()) {
                alert('clip_ids为必填项！');
                return;
            }
            if (activeAudioField && !(rowPayload.audio_url || '').trim()) {
                alert('音频链接为必填项！');
                return;
            }
        }
        if (rowPayload.workflow === 'inspo') {
            rowPayload.cover_audio = '';
            rowPayload.sample_audio = '';
        } else if (rowPayload.workflow === 'cover') {
            rowPayload.inspo_audio = '';
            rowPayload.sample_audio = '';
        } else if (rowPayload.workflow === 'sample') {
            if (currentNodeConfigTab === '音频制作' && !rowPayload.sample_audio) {
                alert('生成方式为 sample 时，请上传 sample 音频！');
                return;
            }
            rowPayload.inspo_audio = '';
            rowPayload.cover_audio = '';
        } else {
            rowPayload.inspo_audio = '';
            rowPayload.cover_audio = '';
            rowPayload.sample_audio = '';
            rowPayload.clip_ids = '';
            rowPayload.audio_url = '';
        }
    }

    rowPayload.configName = configNameVal;
    rowPayload.nodeName = nodeNameVal;
    rowPayload.nodeVersion = nodeVersionVal;
    rowPayload.executionMode = executionModeVal;
    rowPayload.style = styleVal;
    rowPayload.status = '启用';
    rowPayload.creator = creatorVal;
    if (basicModelInput) rowPayload.model = modelVal;
    rowPayload.createTime = createTimeVal;
    rowPayload.remark = remarkVal;

    if (editingNodeConfigId) {
        // Edit
        const item = schema.data.find(d => String(d.id) === String(editingNodeConfigId));
        if (item) {
            Object.assign(item, rowPayload);
        }
    } else {
        // Add
        const maxId = schema.data.length > 0 ? Math.max(...schema.data.map(d => parseInt(d.id))) : 0;
        rowPayload.id = maxId + 1;
        schema.data.push(rowPayload);
    }

    renderNodeConfigTable();
    closeNodeConfigDrawer();
}

function toggleDisableNodeConfig(id) {
    const schema = nodeConfigsSchema[currentNodeConfigTab];
    const item = schema.data.find(d => String(d.id) === String(id));
    if (!item) return;

    if (item.status !== '禁用' && item.status !== '已禁用') {
        openConfirmDialog(
            '禁用确认',
            `确认禁用该配置实例吗？禁用后此风格下的调度真值将被忽略。`,
            '确认禁用',
            true,
            () => {
                item.status = '禁用';
                renderNodeConfigTable();
            }
        );
    } else {
        openConfirmDialog(
            '启用确认',
            `确认重新启用该配置实例吗？`,
            '确认启用',
            false,
            () => {
                item.status = '启用';
                renderNodeConfigTable();
            }
        );
    }
}

function openNodeConfigExportModal() {
    const select = document.getElementById('exportNodeConfigSelect');
    if (select) {
        select.innerHTML = '<option value="all">全部节点</option>';
        Object.keys(nodeConfigsSchema).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.innerText = name;
            if (name === currentNodeConfigTab) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });
    }

    const modal = document.getElementById('nodeConfigExportModal');
    if (modal) {
        modal.style.display = 'flex';
    }
    updateNodeConfigExportCount();
}

function closeNodeConfigExportModal() {
    const modal = document.getElementById('nodeConfigExportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateNodeConfigExportCount() {
    const val = document.getElementById('exportNodeConfigSelect').value;
    let count = 0;
    if (val === 'all') {
        Object.keys(nodeConfigsSchema).forEach(name => {
            count += nodeConfigsSchema[name].data.length;
        });
    } else {
        count = nodeConfigsSchema[val] ? nodeConfigsSchema[val].data.length : 0;
    }
    document.getElementById('exportNodeConfigCount').innerText = count;
}

function confirmNodeConfigExport() {
    const selected = document.getElementById('exportNodeConfigSelect').value;
    const targets = selected === 'all' ? Object.keys(nodeConfigsSchema) : [selected];

    let allRows = [];
    targets.forEach(nodeType => {
        const schema = nodeConfigsSchema[nodeType];
        const headers = ['ID', '配置名称', '节点名称', '节点版本号', '执行模式', '节点属性', '风格', ...schema.configFields.map(f => f.label), ...schema.extraFields.map(f => f.label), '备注', '状态', '创建人', '创建时间'];
        allRows.push(headers);

        schema.data.forEach(d => {
            const row = [d.id, d.configName || nodeType, getNodeConfigNodeDisplayName(nodeType, d.nodeName), d.nodeVersion || getDefaultNodeConfigVersion(nodeType), d.executionMode || getDefaultNodeConfigExecutionMode(nodeType), '机器节点', d.style || '默认'];
            schema.configFields.forEach(f => row.push((d[f.key] || '').replace(/\n/g, ' ')));
            schema.extraFields.forEach(f => row.push((d[f.key] || '').replace(/\n/g, ' ')));
            row.push(d.remark || '', d.status, d.creator, d.createTime);
            allRows.push(row);
        });
        if (selected === 'all') allRows.push([]); // blank separator line
    });

    const csv = '\uFEFF' + allRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selected === 'all' ? '全部配置导出.csv' : `${selected}配置导出.csv`;
    a.click();
    URL.revokeObjectURL(url);
    closeNodeConfigExportModal();
}
