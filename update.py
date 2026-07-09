import re

path = '/Users/suhongju/Desktop/2.0相关资料/原型（打开index.html）/app.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the HTML block
html_old_start = '<!-- Melody -->'
html_old_end = '<!-- CSS for stars rating hover and checked state -->'

html_new = '''<!-- Melody -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">旋律表现 (Melody)</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_melody" id="sr_m3" value="3" style="display:none;" onchange="calculateSongRating()"><label for="sr_m3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_melody" id="sr_m2" value="2" style="display:none;" onchange="calculateSongRating()"><label for="sr_m2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_melody" id="sr_m1" value="1" style="display:none;" onchange="calculateSongRating()"><label for="sr_m1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                          <label for="sr_m0" style="cursor:pointer; display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--gray-600);">
                            <input type="radio" name="sr_melody" id="sr_m0" value="0" onchange="calculateSongRating()"> 0星
                          </label>
                        </div>
                      </div>
                      
                      <!-- Lyrics -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">歌词贴合度 (Lyrics)</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_lyrics" id="sr_l3" value="3" style="display:none;" onchange="calculateSongRating()"><label for="sr_l3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_lyrics" id="sr_l2" value="2" style="display:none;" onchange="calculateSongRating()"><label for="sr_l2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_lyrics" id="sr_l1" value="1" style="display:none;" onchange="calculateSongRating()"><label for="sr_l1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                          <label for="sr_l0" style="cursor:pointer; display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--gray-600);">
                            <input type="radio" name="sr_lyrics" id="sr_l0" value="0" onchange="calculateSongRating()"> 0星
                          </label>
                        </div>
                      </div>
                      
                      <!-- Vocal -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">人声质感 (Vocal)</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_vocal" id="sr_v3" value="3" style="display:none;" onchange="calculateSongRating()"><label for="sr_v3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_vocal" id="sr_v2" value="2" style="display:none;" onchange="calculateSongRating()"><label for="sr_v2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_vocal" id="sr_v1" value="1" style="display:none;" onchange="calculateSongRating()"><label for="sr_v1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                          <label for="sr_v0" style="cursor:pointer; display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--gray-600);">
                            <input type="radio" name="sr_vocal" id="sr_v0" value="0" onchange="calculateSongRating()"> 0星
                          </label>
                        </div>
                      </div>

                      <!-- Audio Quality -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">音频质量 (Audio Quality)</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_audio_quality" id="sr_a3" value="3" style="display:none;" onchange="calculateSongRating()"><label for="sr_a3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_audio_quality" id="sr_a2" value="2" style="display:none;" onchange="calculateSongRating()"><label for="sr_a2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_audio_quality" id="sr_a1" value="1" style="display:none;" onchange="calculateSongRating()"><label for="sr_a1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                          <label for="sr_a0" style="cursor:pointer; display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--gray-600);">
                            <input type="radio" name="sr_audio_quality" id="sr_a0" value="0" onchange="calculateSongRating()"> 0星
                          </label>
                        </div>
                      </div>

                      <!-- Arrangement -->
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <span style="color: var(--gray-700); font-weight: 500;">编曲层次 (Arrangement)</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="stars-rating" style="display: flex; flex-direction: row-reverse; gap: 4px;">
                            <input type="radio" name="sr_arrangement" id="sr_ar3" value="3" style="display:none;" onchange="calculateSongRating()"><label for="sr_ar3" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_arrangement" id="sr_ar2" value="2" style="display:none;" onchange="calculateSongRating()"><label for="sr_ar2" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                            <input type="radio" name="sr_arrangement" id="sr_ar1" value="1" style="display:none;" onchange="calculateSongRating()"><label for="sr_ar1" style="font-size: 22px; color: var(--gray-300); cursor: pointer;">★</label>
                          </div>
                          <label for="sr_ar0" style="cursor:pointer; display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--gray-600);">
                            <input type="radio" name="sr_arrangement" id="sr_ar0" value="0" onchange="calculateSongRating()"> 0星
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- CSS for stars rating hover and checked state -->'''

start_idx = content.find(html_old_start)
end_idx = content.find(html_old_end) + len(html_old_end)
if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + html_new + content[end_idx:]

# Also fix the subtitle text for stars
sub_old = '请仔细聆听生成的音频，并就以下维度分别给出 1-5 星评分。'
sub_new = '请仔细聆听生成的音频，并就以下维度分别给出 0-3 星评分。'
content = content.replace(sub_old, sub_new)

# Replace the calculateSongRating function
js_old_start = 'function calculateSongRating() {'
js_old_end = 'function quickRejectSongReview(reason, btnEl) {'

js_new = '''function calculateSongRating() {
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

    // Clear quick reject buttons UI active state
    document.querySelectorAll('.sr-quick-reject-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.borderColor = 'var(--gray-300)';
        btn.style.color = 'var(--gray-600)';
    });

    if (count === 5) {
        const finalSection = document.getElementById('srFinalSection');
        if (finalSection) finalSection.style.display = 'block';
        
        let color, bg;
        if (has0 || total < 7) {
            currentSongRating = 'C'; color = 'var(--danger)'; bg = 'var(--danger-light)'; isSongReviewReject = true;
        } else if (!has1 && (total === 14 || total === 15)) {
            currentSongRating = 'S'; color = '#722ed1'; bg = '#f9f0ff'; isSongReviewReject = false;
        } else if (!has1 && (total === 12 || total === 13)) {
            currentSongRating = 'A+'; color = 'var(--success)'; bg = 'var(--success-light)'; isSongReviewReject = false;
        } else if ((!has1 && (total === 10 || total === 11)) || (has1 && (total === 12 || total === 13))) {
            currentSongRating = 'A'; color = 'var(--success)'; bg = 'var(--success-light)'; isSongReviewReject = false;
        } else if (!has0 && total >= 7 && total <= 11) {
            currentSongRating = 'B+'; color = 'var(--warning)'; bg = 'var(--warning-light)'; isSongReviewReject = false;
        } else {
            currentSongRating = 'C'; color = 'var(--danger)'; bg = 'var(--danger-light)'; isSongReviewReject = true;
        }

        updateSongReviewUI(color, bg);
    } else {
        const finalSection = document.getElementById('srFinalSection');
        if (finalSection) finalSection.style.display = 'none';
    }
}

'''

js_start_idx = content.find(js_old_start)
js_end_idx = content.find(js_old_end)
if js_start_idx != -1 and js_end_idx != -1:
    content = content[:js_start_idx] + js_new + content[js_end_idx:]
else:
    print("Failed to find calculateSongRating function")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

