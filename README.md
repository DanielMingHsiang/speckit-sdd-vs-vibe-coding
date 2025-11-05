# 概述
嘗試使用 Github Spec-Kit 進行規格驅動開發 (Spec-Driven Development, SDD)，並與自從 GenAI 火熱起來後社群文化非常流行的 Vibe Coding 進行使用上的差異比較，並且記錄 Vibe Coding、SDD、TDD 的概念。

# 氛圍式編碼 (Vibe Coding)
## 是什麼？
- 不是一個正式的 computer science term，比較像社群文化。
- 大意是：不是很嚴肅地在做 Task 或 Project，而是**跟著感覺寫、跟著靈感 freestyle 走。**
- vibe coding 場景：
    |  範例                        | 說明                                    |
    | ------------------------------ | ------------------------------------ |
    | 開個 VSCode, 寫邏輯、調效果    | 它不是要 deliver feature, 是享受 flow 狀態  |
    | 不先寫 spec, 直接做原型        | 不把問題拆太細、先動手感受                   |
    | 偏向草稿的程式開發              | 不是寫 production code，是 sketching code |
- 不是技術術語而是一種 **coding 心態 / 工作 flow**。先不管 code 是不是最嚴謹，邊做邊產生想法。
- 流行原因：
    - **GenAI coding 模式出現後「先動手⭢再 refine」變超有效**，享受用「需求描述」的方式寫程式。
    - 給模型一句 prompt ⭢ AI spit 出一些 code ⭢ 跑跑看，更改 prompt ⭢ 迭代直到好看/好用。比「先花Ｘ天寫 PRD」更快看到產品雛形的感受。 
- 一句話總結：vibe coding = coding as creative flow，不是 coding as “執行任務”。
## 缺點
- 雖然有它的「爽感」但以正式產品角度來說很危險。
    1. 很容易變成 **丟棄式程式碼**
        - 因為不是先定 spec、也沒有邏輯分層。
        - 寫起來像草圖，結果：不好拆 component、難 refactor、難擴充。
    2. 大部分 vibe code 只能 demo 不能上 production。
    3. 決策品質低、偏異程度高
        - 因為靠「感覺」，容易限縮於目前最想做的**單點功能**會忽略 edge case / failure mode。
    4. debug 惡夢
        - vibe coding 通常會直接把變數丟來丟去，所以「局部程式錯誤」會很難回溯。
        - 有時候自己寫的 code 過段時間都看不懂，AI 短時間寫大量程式碼，然後一直修正不了錯誤，你會想幫它 debug 嗎？
    5. Knowledge 不會被沉澱
        - 因為沒有用 spec 把規格與需求記下來，最後會忘記「為什麼要這樣寫」。
        - 後面的人很難接手，難以繼承 「AI 的即興發揮智慧」，只好再叫 AI 即性發揮下去。
- 一句話收斂：vibe coding 是 prototype 加速器，不是 delivery 正式產品的系統。只適合「需求還沒被固定」的階段。
- 來自社群的一張梗圖：

![image](images/vibe-coding-mock.png)

資訊工程師：(吐一口放鬆的氣) 看來我還能活一陣子

# 規格驅動開發 (Spec-Driven Development, SDD)
## 是什麼？
- 先產出「規格」(通常是明確、程式可對齊的 規格 / 約定 / schema / test)。然後 — 程式碼必須符合該規格
- 規格是源頭，不是程式碼。可以把它想成：
    - 需求不是單純在寫想要什麼功能，而是寫成可以驗證的規格 (spec)
    - 然後全部的 code / API / test / UI / agent / infra 全都要對齊它。

- 一句話說明：不是先寫 code 再補文件，是先有規格 ⭢ 再寫 code ⭢ code 無法偏離規格約束。

## [非常重要] 不是「文檔」先，而是「可執行的規格」先
SDD 真正精神：
| 有落實 SDD                                 | 沒落實 SDD                                 |
| ----------------------------------------- | ----------------------------------------- |
| spec 是 JSON schema / OpenAPI / test case | spec 是會議討論 + notion 記錄                |
| spec 可以 CI 驗證                          | spec 是寫完就變裝飾                          |
| SD/PG 看 spec 進行 coding                      | SD/PG 看畫面 coding / 拿 PM 的口頭定義 coding |
| spec 改了 ⭢  code 就要改                   | code 改了 ⭢ 文件才來補                      |

## SDD 帶來什麼？
| 效益                   | 為什麼                                 |
| --------------------- | -----------------------------------   |
| 溝通成本降低            | 全部角色共同參考單一 source of truth      |
| code 可自動生成         | AI 看得懂。有 spec ⭢ 可產 code          |
| 測試案例容易撰寫         | spec 定義行為 ⭢ test case 直接對齊 spec |
| AI agent 非常好對齊     | spec 明確，是最適合作為 AI 的 input            |

> 在 AI Agent 工程興起的時代，相比傳統 TDD/DDD，SDD 具有非常大的價值

## 和測試驅動開發 (Test-Driven Develpoment, TDD) 的比較
| TDD                 | SDD                          |
| ------------------- | ---------------------------- |
| test 驅動 code       | spec 驅動 code               |
| test 是實現層         | spec 是行為約束               |
| test 主張微觀層次     | spec 主張宏觀層次約束           |

## 一句話總結
Spec-Driven Development = 用可執行規格當源頭 ⭢ code 只是實現 spec 的產物。
---

## 案例
