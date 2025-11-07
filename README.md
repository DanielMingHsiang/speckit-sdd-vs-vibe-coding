<p align="center">
    <strong>嘗試使用 Github Spec-Kit 進行規格驅動開發 (Spec-Driven Development, SDD)，與自從 GenAI 火熱起來後社群文化非常流行的 Vibe Coding 進行使用上的差異比較，</strong>
</p>
<p align="center">
    <strong>以及記錄 Vibe Coding、SDD、TDD 的概念。</strong>
</p>

# 氛圍式編碼 (Vibe Coding)
## 是什麼？
- 不是一個正式的 computer science 術語，比較像社群文化。
- 大意是：用白話文或直覺性的「感覺」（Vibe）**來告訴 AI 你想要實現的功能、效果或設計**
- vibe coding 場景：
    |  範例                        | 說明                                    |
    | ------------------------------ | ------------------------------------ |
    | 開個 VSCode, 寫邏輯、調效果    | 它不是要 deliver feature, 是享受 flow 狀態  |
    | 不先寫 spec, 直接做原型        | 不把問題拆太細、先動手感受                   |
    | 偏向草稿的程式開發              | 不是寫 production code，是 sketching code |
- 不是技術術語而是一種 **coding 心態 / 工作 flow**。先拋開嚴謹的程式架構，邊做邊產生想法。
- 流行原因：
    - **GenAI coding 模式出現後「先動手⭢再 refine」變超有效**，享受用「需求描述」的方式寫程式。
    - 給模型一句 prompt ⭢ AI spit 出一些 code ⭢ 跑跑看，更改 prompt ⭢ 迭代直到好看/好用。比起「先花Ｘ天寫 PRD」更快看到產品雛形與實際感受。 
- 一句話總結：vibe coding = coding as creative flow，不是 coding as **執行任務**。
## 優點
| 優勢 | 說明 |
| :--- | :--- |
| **低技術門檻** | **一般人也能開發**，不用精通程式，用講的就能寫出簡單應用。 |
| **加速原型開發 (MVP)** | **速度快**，適合快速建構 MVP（Minimum Viable Product）或測試新點子。 |
|試錯成本低	|快速產出產品原型，讓測試和修改的成本相對較低。|

## 缺點
雖然有它的「爽感」但以正式產品角度來說很危險。
1. 很容易變成 **丟棄式程式碼**
    - 因為不是先定 spec、也沒有邏輯分層。
    - 寫起來像草圖，結果：不好拆 component、難 refactor、難擴充。
2. 大部分 vibe code 只能 demo 不能上 production。
3. 決策品質低、偏異程度高
    - 因為靠「感覺」，容易限縮於目前最想做的**單點功能**會忽略 edge case / failure mode。
4. debug 惡夢
    - vibe coding 通常會直接把變數丟來丟去，所以「局部程式錯誤」會很難回溯。
    - AI 短時間寫大量程式碼，然後一直修正不了錯誤，你想幫它 debug 嗎？
5. Knowledge 不會被沉澱
    - 因為沒有用 spec 把規格與需求記下來，最後會忘記「為什麼要這樣寫」。
    - 後面的人很難接手，難以繼承 「AI 的即興發揮智慧」，只好再叫 AI 即性發揮下去。

## 一句話收斂
> vibe coding 是 prototype 加速器，不是 delivery 正式產品的系統。只適合「需求還沒被固定」的階段。  

來自社群的一張梗圖：

![image](images/vibe-coding-mock.png)

資訊工程師：(吐一口放鬆的氣) 看來我還能活一陣子

# 規格驅動開發 (Spec-Driven Development, SDD)
## 是什麼？
一種軟體開發的方法論，在 AI 輔助程式設計的時代中變得更重要。  
核心思想：
- 規格先行，程式碼在後： 
    > 寫程式碼之前，先創建一個清晰、結構化且可測試的「規格」（Specification 或 Spec）。
- 規格即真理的來源 (Source of Truth)： 
    > 規格文件取代以往以程式碼作為真理來源的地位。它詳細描述了 **「要做什麼」（What）以及「為什麼做」（Why）**，作為專案的最高依據。
- AI 代理的藍圖：
    > 規格成為 AI 編碼工具用來生成、測試和驗證的主要藍圖和合約。
- SDD 帶來什麼？  
    | 效益                   | 為什麼                                 |
    | --------------------- | -----------------------------------   |
    | 溝通成本降低            | 全部角色共同參考單一 source of truth      |
    | code 可自動生成         | AI 看得懂。有 spec ⭢ 可產 code          |
    | 測試案例容易撰寫         | spec 定義行為 ⭢ test case 直接對齊 spec |
    | AI agent 非常好對齊     | spec 明確，是最適合作為 AI 的 input      |
- 一句話說明：
    > 不是先寫 code 再補文件，是先有規格 ⭢ 再寫 code ⭢ code 無法偏離規格約束。|

## ⚔️ SDD 與 Vibe Coding 對比
| 特點 | SDD | Vibe Coding |
| :--- | :--- | :--- |
| **核心精神** | **意圖即真理**。<br/>以**清晰、結構化的規格**為最高依據。 | **流程即自由**。<br/>依賴開發者的直覺、自然語言提示和 AI 的即時輸出。 |
| **程式碼角色** | **規格的執行結果。** <br/>程式碼是可替換的、自動生成的產物。 | **思考的過程。** <br/>程式碼是即時生成，通常較混亂，很難追蹤邏輯。 |
| **品質標準** | **高且可驗證。** <br/>程式碼必須能追溯回規格中的每個驗收標準 | **不穩定且參差不齊。<br/>** 程式碼品質依賴於 Prompt 品質和 AI 的「心情」。 |
| **流程主導者** | **規格文件 (Spec)。** <br/>規格驅動計劃、任務拆解、程式碼生成和測試。 | **人類提示詞。** <br/>提示詞驅動生成，缺乏結構和嚴謹規劃。 |
| **人類角色** | **設計師與架構師。** <br/>專注於定義意圖、架構設計和審核 AI 輸出。 | **操作者與修復者。** <br/>專注於快速迭代和修復 AI 生成的錯誤。(極度痛苦) |
| **優勢** | **品質、可維護性、可擴展性。** <br/>適用於複雜、企業級、長期維護的專案。 | **速度、創意、原型製作。** <br/>適用於快速原型、概念驗證 (PoC) 和個人實驗。 |
| **痛點** | 前期投入時間長。<br/>必須先寫好**結構化規格**。 | **技術債務高昂**。<br/>難以在規模化生產環境中維護和除錯。 |      |

## 和測試驅動開發 (Test-Driven Develpoment, TDD) 的比較
| TDD                 | SDD                          |
| ------------------- | ---------------------------- |
| test 驅動 code       | spec 驅動 code               |
| test 是實現層        | spec 是行為約束               |
| test 主張微觀層次約束  | spec 主張宏觀層次約束          |

## 一句話總結
> Spec-Driven Development = 用可執行規格當源頭 ⭢ code 只是實現 spec 的產物。

## Github Spec Kit 實作
- [官方 Spec kit](https://github.com/github/spec-kit)  
- [中文 Speckit](https://github.com/doggy8088/spec-kit)
- 實作使用 Claude Code
## 步驟
1. 建立專案原則
    ```bash
    /speckit.constitution 建立以下準則 
        1. 一律使用繁體中文
        2. 重視程式碼品質，使用者體驗一致性。
        3. 設計最小可行產品MVP，不要過度設計。
        # 4. 遵守 @生成式人工智慧安全準則 # 額外提供的安全準則
    ```
    - 產生 spec-kit-aws-question-web/.specify/memory/constitution.md
2. 建立規格  
這個步驟 spec kit 會自動幫你使用 git 建立新分支，未來功能經過驗證，可以 merge 回主分支。
    ```
    /speckit.specify 建立一個試題網頁方便 AWS 證照考生複習考題
        1. 具有中英文切換功能，每道題目一個區塊，區塊內分為題目、選項、詳解三個子區塊。
        2. 答案、選項、詳解子區塊可摺疊隱藏，方便考生專注閱讀題目。
        3. 具有分頁功能，每頁顯示五題。
        4. 具有可切換分頁的導航列，固定於頁面底部，並且不隨頁面滾動而改變位置。
        5. 試題使用 @question.json。
    ```
    - 產生 specs/001-aws-exam-web/checklists/requirements.md。
    - 產生 specs/001-aws-exam-web/spec.md。
    > 因為使用中文，在產生規格文件的時候有編碼問題，我直接請 claude 修正。
3. 釐清未明確定義
    ```
    /speckit.clarify
    ```
    - claude 會與你互動，要求澄清規格模糊地帶。
4. 建立技術實作計畫
   ```
   /speckit.plan
       1. 使用 Vue3.js, Scss, Typescript 撰寫網頁應用程式。
       2. 前端建構工具使用 vite。
       3. 不需要建立後端程式，並且題庫來源使用 @questions.js。
       4. 盡量減少額外使用的 library。
   ```
   - 產生 specs/001-aws-exam-web/plan.md。
   - 產生 specs/001-aws-exam-web/research.md。
   - 產生 specs/001-aws-exam-web/quickstart.md。
   - 產生 specs/001-aws-exam-web/data-model.md。
   - 產生 specs/001-aws-exam-web/contracts/api.ts。
   - 產生 specs/001-aws-exam-web/contracts/types.ts。
5. 拆解為任務
   ```
   /speckit.tasks
   ```
6. 分析一致性與覆蓋度
   ```
   /speckit.analyze
   ```
7. 執行實作
   ```
   /speckit.implement
   ```
## 最終規格資料夾結構
```
./specs/
├── spec-kit-aws-question-web
│   └── .specify/memory
│       └── constitution.md
└── 001-aws-exam-web
    ├── checklists
    │   └── requirements.md
    ├── contracts
    │   ├── api.ts
    │   └── types.ts
    ├── data-model.md
    ├── plan.md
    ├── quickstart.md
    ├── research.md
    ├── spec.md
    └── tasks.md
```

---
