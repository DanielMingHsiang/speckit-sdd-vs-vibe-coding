/**
 * AWS 證照考題複習網頁 - 題目資料
 *
 * 包含至少15道AWS證照考題的中英文雙語資料
 * 符合 Question 介面格式要求
 */

import type { Question } from '@/types/types'

export const questions: Question[] = [
  {
    question_number: 1,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A company is implementing an application on Amazon EC2 instances. The application needs to process incoming transactions. When the application detects a transaction that is not valid, the application must send a chat message to the company's support team. To send the message, the application needs to retrieve the access token to authenticate by using the chat API. A developer needs to implement a solution to store the access token. The access token must be encrypted at rest and in transit. The access token must also be accessible from other AWS accounts. Which solution will meet these requirements with the LEAST management overhead?",
    question_text_zh: "一家公司正在 Amazon EC2 執行個體上實作應用程式。應用程式需要處理傳入的交易。當應用程式偵測到無效交易時，必須向公司的支援團隊傳送聊天訊息。為了傳送訊息，應用程式需要擷取存取權杖以透過聊天 API 進行驗證。開發人員需要實作儲存存取權杖的解決方案。存取權杖必須在靜止時和傳輸中加密。存取權杖也必須可從其他 AWS 帳戶存取。哪個解決方案能以最少的管理負擔滿足這些要求？",
    options_en: [
      "A. Use an AWS Systems Manager Parameter Store SecureString parameter that uses an AWS Key Management Service (AWS KMS) AWS managed key to store the access token. Add a resource-based policy to the parameter to allow access from other accounts. Update the IAM role of the EC2 instances with permissions to access Parameter Store. Retrieve the token from Parameter Store with the decrypt flag enabled. Use the decrypted access token to send the message to the chat.",
      "B. Encrypt the access token by using an AWS Key Management Service (AWS KMS) customer managed key. Store the access token in an Amazon DynamoDB table. Update the IAM role of the EC2 instances with permissions to access DynamoDB and AWS KMS. Retrieve the token from DynamoDB. Decrypt the token by using AWS KMS on the EC2 instances. Use the decrypted access token to send the message to the chat.",
      "C. Use AWS Secrets Manager with an AWS Key Management Service (AWS KMS) customer managed key to store the access token. Add a resource-based policy to the secret to allow access from other accounts. Update the IAM role of the EC2 instances with permissions to access Secrets Manager. Retrieve the token from Secrets Manager. Use the decrypted access token to send the message to the chat.",
      "D. Encrypt the access token by using an AWS Key Management Service (AWS KMS) AWS managed key. Store the access token in an Amazon S3 bucket. Add a bucket policy to the S3 bucket to allow access from other accounts. Update the IAM role of the EC2 instances with permissions to access Amazon S3 and AWS KMS. Retrieve the token from the S3 bucket. Decrypt the token by using AWS KMS on the EC2 instances. Use the decrypted access token to send the message to the chat."
    ],
    options_zh: [
      "A. 使用 AWS Systems Manager Parameter Store SecureString 參數，該參數使用 AWS Key Management Service (AWS KMS) AWS 受管金鑰來儲存存取權杖。在參數上新增資源型政策以允許從其他帳戶存取。使用存取 Parameter Store 的許可更新 EC2 執行個體的 IAM 角色。啟用解密旗標從 Parameter Store 擷取權杖。使用解密的存取權杖將訊息傳送到聊天。",
      "B. 使用 AWS Key Management Service (AWS KMS) 客戶受管金鑰加密存取權杖。將存取權杖儲存在 Amazon DynamoDB 資料表中。使用存取 DynamoDB 和 AWS KMS 的許可更新 EC2 執行個體的 IAM 角色。從 DynamoDB 擷取權杖。在 EC2 執行個體上使用 AWS KMS 解密權杖。使用解密的存取權杖將訊息傳送到聊天。",
      "C. 使用 AWS Secrets Manager 搭配 AWS Key Management Service (AWS KMS) 客戶受管金鑰來儲存存取權杖。在機密上新增資源型政策以允許從其他帳戶存取。使用存取 Secrets Manager 的許可更新 EC2 執行個體的 IAM 角色。從 Secrets Manager 擷取權杖。使用解密的存取權杖將訊息傳送到聊天。",
      "D. 使用 AWS Key Management Service (AWS KMS) AWS 受管金鑰加密存取權杖。將存取權杖儲存在 Amazon S3 儲存貯體中。在 S3 儲存貯體上新增儲存貯體政策以允許從其他帳戶存取。使用存取 Amazon S3 和 AWS KMS 的許可更新 EC2 執行個體的 IAM 角色。從 S3 儲存貯體擷取權杖。在 EC2 執行個體上使用 AWS KMS 解密權杖。使用解密的存取權杖將訊息傳送到聊天。"
    ],
    correct_answer: "C",
    explanation: "AWS Secrets Manager 是專門為儲存和管理機密資訊（如存取權杖、密碼和API金鑰）而設計的。它提供自動加密、版本控制和輪換功能，並支援跨帳戶存取的資源型政策。相比其他選項，Secrets Manager 需要最少的管理負擔，因為它自動處理加密和解密，不需要手動管理KMS金鑰的細節。",
    tips: [
      "AWS Secrets Manager 專門用於儲存敏感資訊",
      "支援自動加密和解密",
      "可透過資源型政策實現跨帳戶存取",
      "比手動管理 KMS 金鑰更簡單"
    ]
  },
  {
    question_number: 2,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A company is running Amazon EC2 instances in multiple AWS accounts. A developer needs to implement an application that collects all the lifecycle events of the EC2 instances. The application needs to store the lifecycle events in a single Amazon Simple Queue Service (Amazon SQS) queue in the company's main AWS account for further processing. Which solution will meet these requirements?",
    question_text_zh: "一家公司在多個 AWS 帳戶中執行 Amazon EC2 執行個體。開發人員需要實作一個應用程式來收集所有 EC2 執行個體的生命週期事件。應用程式需要將生命週期事件儲存在公司主要 AWS 帳戶中的單一 Amazon Simple Queue Service (Amazon SQS) 佇列中，以便進一步處理。哪個解決方案能滿足這些要求？",
    options_en: [
      "A. Configure Amazon EC2 to deliver the EC2 instance lifecycle events from all accounts to the Amazon EventBridge event bus of the main account. Add an EventBridge rule to the event bus of the main account that matches all EC2 instance lifecycle events. Add the SQS queue as a target of the rule.",
      "B. Use the resource policies of the SQS queue in the main account to give each account permissions to write to that SQS queue. Add to the Amazon EventBridge event bus of each account an EventBridge rule that matches all EC2 instance lifecycle events. Add the SQS queue in the main account as a target of the rule.",
      "C. Write an AWS Lambda function that scans through all EC2 instances in the company accounts to detect EC2 instance lifecycle changes. Configure the Lambda function to write a notification message to the SQS queue in the main account if the function detects an EC2 instance lifecycle change. Add an Amazon EventBridge scheduled rule that invokes the Lambda function every minute.",
      "D. Configure the permissions on the main account event bus to receive events from all accounts. Create an Amazon EventBridge rule in each account to send all the EC2 instance lifecycle events to the main account event bus. Add an EventBridge rule to the main account event bus that matches all EC2 instance lifecycle events. Set the SQS queue as a target for the rule."
    ],
    options_zh: [
      "A. 設定 Amazon EC2 將所有帳戶的 EC2 執行個體生命週期事件傳送到主要帳戶的 Amazon EventBridge 事件匯流排。在主要帳戶的事件匯流排上新增 EventBridge 規則，該規則符合所有 EC2 執行個體生命週期事件。將 SQS 佇列新增為規則的目標。",
      "B. 使用主要帳戶中 SQS 佇列的資源政策，為每個帳戶提供寫入該 SQS 佇列的許可。在每個帳戶的 Amazon EventBridge 事件匯流排上新增 EventBridge 規則，該規則符合所有 EC2 執行個體生命週期事件。將主要帳戶中的 SQS 佇列新增為規則的目標。",
      "C. 撰寫 AWS Lambda 函數來掃描公司帳戶中的所有 EC2 執行個體，以偵測 EC2 執行個體生命週期變更。如果函數偵測到 EC2 執行個體生命週期變更，則設定 Lambda 函數將通知訊息寫入主要帳戶中的 SQS 佇列。新增每分鐘叫用 Lambda 函數的 Amazon EventBridge 排程規則。",
      "D. 在主要帳戶事件匯流排上設定許可以接收來自所有帳戶的事件。在每個帳戶中建立 Amazon EventBridge 規則，將所有 EC2 執行個體生命週期事件傳送到主要帳戶事件匯流排。在主要帳戶事件匯流排上新增 EventBridge 規則，該規則符合所有 EC2 執行個體生命週期事件。將 SQS 佇列設定為規則的目標。"
    ],
    correct_answer: "D",
    explanation: "選項D是正確的跨帳戶事件處理方式。首先配置主要帳戶的事件匯流排接收來自其他帳戶的事件，然後在每個帳戶建立規則將EC2生命週期事件轉發到主要帳戶，最後在主要帳戶建立規則將這些事件轉發到SQS佇列。這是EventBridge跨帳戶事件路由的標準模式。",
    tips: [
      "EventBridge 支援跨帳戶事件路由",
      "需要在主要帳戶和來源帳戶都配置規則",
      "主要帳戶的事件匯流排需要適當的權限設定",
      "避免使用輪詢方式，應使用事件驅動架構"
    ]
  },
  {
    question_number: 3,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] An application is using Amazon Cognito user pools and identity pools for secure access. A developer wants to integrate the user-specific file upload and download features in the application with Amazon S3. The developer must ensure that the files are saved and retrieved in a secure manner and that users can access only their own files. The file sizes range from 3 KB to 300 MB. Which option will meet these requirements with the HIGHEST level of security?",
    question_text_zh: "應用程式使用 Amazon Cognito 使用者集區和身分集區進行安全存取。開發人員想要將應用程式中的使用者特定檔案上傳和下載功能與 Amazon S3 整合。開發人員必須確保檔案以安全方式儲存和擷取，並且使用者只能存取自己的檔案。檔案大小範圍從 3 KB 到 300 MB。哪個選項能以最高安全層級滿足這些要求？",
    options_en: [
      "A. Use S3 Event Notifications to validate the file upload and download requests and update the user interface (UI).",
      "B. Save the details of the uploaded files in a separate Amazon DynamoDB table. Filter the list of files in the user interface (UI) by comparing the current user ID with the user ID associated with the file in the table.",
      "C. Use Amazon API Gateway and an AWS Lambda function to upload and download files. Validate each request in the Lambda function before performing the requested operation.",
      "D. Use an IAM policy within the Amazon Cognito identity prefix to restrict users to use their own folders in Amazon S3."
    ],
    options_zh: [
      "A. 使用 S3 事件通知來驗證檔案上傳和下載請求並更新使用者介面 (UI)。",
      "B. 將上傳檔案的詳細資訊儲存在單獨的 Amazon DynamoDB 資料表中。透過比較目前使用者 ID 與資料表中與檔案相關聯的使用者 ID，在使用者介面 (UI) 中篩選檔案清單。",
      "C. 使用 Amazon API Gateway 和 AWS Lambda 函數來上傳和下載檔案。在執行請求的操作之前，在 Lambda 函數中驗證每個請求。",
      "D. 在 Amazon Cognito 身分前綴內使用 IAM 政策，限制使用者只能使用 Amazon S3 中自己的資料夾。"
    ],
    correct_answer: "D",
    explanation: "選項D使用Cognito身分前綴的IAM政策是最安全的方法。這種方法在AWS服務層級強制執行存取控制，確保使用者只能存取以其身分ID為前綴的S3物件路徑。這比應用程式層級的驗證更安全，因為即使應用程式有漏洞，AWS IAM仍會阻止未授權的存取。",
    tips: [
      "Cognito 身分前綴提供服務層級的安全控制",
      "IAM 政策在 AWS 層級強制執行權限",
      "比應用程式層級驗證更安全",
      "適合檔案大小變化範圍較大的場景"
    ]
  },
  {
    question_number: 4,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A company is building a scalable data management solution by using AWS services to improve the speed and agility of development. The solution will ingest large volumes of data from various sources and will process this data through multiple business rules and transformations. The solution requires business rules to run in sequence and to handle reprocessing of data if errors occur when the business rules run. The company needs the solution to be scalable and to require the least possible maintenance. Which AWS service should the company use to manage and automate the orchestration of the data flows to meet these requirements?",
    question_text_zh: "一家公司正在使用 AWS 服務建構可擴展的資料管理解決方案，以提高開發速度和敏捷性。該解決方案將從各種來源擷取大量資料，並透過多個業務規則和轉換處理這些資料。解決方案要求業務規則按順序執行，並處理在業務規則執行時發生錯誤的資料重新處理。公司需要解決方案具有可擴展性且需要最少的維護。公司應該使用哪個 AWS 服務來管理和自動化資料流程的協調以滿足這些要求？",
    options_en: [
      "A. AWS Batch",
      "B. AWS Step Functions",
      "C. AWS Glue",
      "D. AWS Lambda"
    ],
    options_zh: [
      "A. AWS Batch",
      "B. AWS Step Functions",
      "C. AWS Glue",
      "D. AWS Lambda"
    ],
    correct_answer: "B",
    explanation: "AWS Step Functions 是專門用於協調和管理工作流程的服務，特別適合需要按順序執行業務規則的場景。它提供內建的錯誤處理、重試機制和可視化工作流程，可以輕鬆管理複雜的資料處理管線。相比其他選項，Step Functions 在協調多個服務和處理錯誤方面具有明顯優勢。",
    tips: [
      "Step Functions 專門用於工作流程協調",
      "提供內建的錯誤處理和重試機制",
      "支援可視化工作流程設計",
      "可以協調多個 AWS 服務"
    ]
  },
  {
    question_number: 5,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A developer has created an AWS Lambda function that is written in Python. The Lambda function reads data from objects in Amazon S3 and writes data to an Amazon DynamoDB table. The function is successfully invoked from an S3 event notification when an object is created. However, the function fails when it attempts to write to the DynamoDB table. What is the MOST likely cause of this issue?",
    question_text_zh: "開發人員建立了用 Python 撰寫的 AWS Lambda 函數。Lambda 函數從 Amazon S3 中的物件讀取資料並將資料寫入 Amazon DynamoDB 資料表。當建立物件時，函數成功地從 S3 事件通知叫用。但是，當函數嘗試寫入 DynamoDB 資料表時失敗。此問題最可能的原因是什麼？",
    options_en: [
      "A. The Lambda function's concurrency limit has been exceeded.",
      "B. DynamoDB table requires a global secondary index (GSI) to support writes.",
      "C. The Lambda function does not have IAM permissions to write to DynamoDB.",
      "D. The DynamoDB table is not running in the same Availability Zone as the Lambda function."
    ],
    options_zh: [
      "A. Lambda 函數的並行限制已超過。",
      "B. DynamoDB 資料表需要全域次要索引 (GSI) 來支援寫入。",
      "C. Lambda 函數沒有寫入 DynamoDB 的 IAM 許可。",
      "D. DynamoDB 資料表未在與 Lambda 函數相同的可用區域中執行。"
    ],
    correct_answer: "C",
    explanation: "由於Lambda函數能夠成功從S3讀取資料，但無法寫入DynamoDB，最可能的原因是IAM權限問題。Lambda函數需要適當的IAM角色和政策才能寫入DynamoDB資料表。當函數可以執行某些操作但無法執行其他操作時，通常表示權限配置不完整。",
    tips: [
      "Lambda 函數需要適當的 IAM 權限",
      "檢查執行角色是否包含 DynamoDB 寫入權限",
      "S3 和 DynamoDB 需要分別的權限設定",
      "可用區域不影響 DynamoDB 存取"
    ]
  },
  {
    question_number: 6,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A developer is creating an AWS CloudFormation template to deploy Amazon EC2 instances across multiple AWS accounts. The developer must choose the EC2 instances from a list of approved instance types. How can the developer incorporate the list of approved instance types in the CloudFormation template?",
    question_text_zh: "開發人員正在建立 AWS CloudFormation 範本以在多個 AWS 帳戶中部署 Amazon EC2 執行個體。開發人員必須從已核准的執行個體類型清單中選擇 EC2 執行個體。開發人員如何在 CloudFormation 範本中整合已核准的執行個體類型清單？",
    options_en: [
      "A. Create a separate CloudFormation template for each EC2 instance type in the list.",
      "B. In the Resources section of the CloudFormation template, create resources for each EC2 instance type in the list.",
      "C. In the CloudFormation template, create a separate parameter for each EC2 instance type in the list.",
      "D. In the CloudFormation template, create a parameter with the list of EC2 instance types as AllowedValues."
    ],
    options_zh: [
      "A. 為清單中的每個 EC2 執行個體類型建立單獨的 CloudFormation 範本。",
      "B. 在 CloudFormation 範本的 Resources 區段中，為清單中的每個 EC2 執行個體類型建立資源。",
      "C. 在 CloudFormation 範本中，為清單中的每個 EC2 執行個體類型建立單獨的參數。",
      "D. 在 CloudFormation 範本中，建立一個參數，將 EC2 執行個體類型清單作為 AllowedValues。"
    ],
    correct_answer: "D",
    explanation: "使用參數的AllowedValues屬性是在CloudFormation範本中限制可選值的標準方法。這樣可以確保只能選擇預先核准的執行個體類型，同時保持範本的靈活性和可重用性。這種方法比建立多個範本或參數更簡潔有效。",
    tips: [
      "AllowedValues 可限制參數的可選值",
      "保持範本的靈活性和可重用性",
      "避免建立多個重複的範本或參數",
      "CloudFormation 會自動驗證輸入值"
    ]
  },
  {
    question_number: 7,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A developer has an application that makes batch requests directly to Amazon DynamoDB by using the BatchGetItem low-level API operation. The responses frequently return values in the UnprocessedKeys element. Which actions should the developer take to increase the resiliency of the application when the batch response includes values in UnprocessedKeys? (Choose two.)",
    question_text_zh: "開發人員有一個應用程式，使用 BatchGetItem 低階 API 操作直接向 Amazon DynamoDB 發出批次請求。回應經常在 UnprocessedKeys 元素中回傳值。當批次回應包含 UnprocessedKeys 中的值時，開發人員應該採取哪些行動來增加應用程式的復原力？（選擇兩個。）",
    options_en: [
      "A. Retry the batch operation immediately.",
      "B. Retry the batch operation with exponential backoff and randomized delay.",
      "C. Update the application to use an AWS software development kit (AWS SDK) to make the requests.",
      "D. Increase the provisioned read capacity of the DynamoDB tables that the operation accesses.",
      "E. Increase the provisioned write capacity of the DynamoDB tables that the operation accesses."
    ],
    options_zh: [
      "A. 立即重試批次操作。",
      "B. 使用指數退避和隨機延遲重試批次操作。",
      "C. 更新應用程式以使用 AWS 軟體開發套件 (AWS SDK) 發出請求。",
      "D. 增加操作存取的 DynamoDB 資料表的佈建讀取容量。",
      "E. 增加操作存取的 DynamoDB 資料表的佈建寫入容量。"
    ],
    correct_answer: "BC",
    explanation: "UnprocessedKeys通常表示請求超過了DynamoDB的容量限制或遇到了節流。選項B使用指數退避和隨機延遲是處理節流的最佳實踐。選項C使用AWS SDK也是正確的，因為SDK會自動處理重試邏輯和錯誤處理，包括UnprocessedKeys的重試。",
    tips: [
      "UnprocessedKeys 通常表示容量限制或節流",
      "指數退避可以避免重複的容量衝突",
      "AWS SDK 提供內建的重試機制",
      "BatchGetItem 是讀取操作，需要考慮讀取容量"
    ]
  },
  {
    question_number: 8,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A developer is working on an application that needs to encrypt data at rest in Amazon S3. The application must use customer-managed keys in AWS Key Management Service (AWS KMS) for encryption. The developer needs to ensure that the application can decrypt the data when needed. What is the MOST secure way to grant the application access to the KMS key?",
    question_text_zh: "開發人員正在開發一個需要在 Amazon S3 中加密靜態資料的應用程式。應用程式必須使用 AWS Key Management Service (AWS KMS) 中的客戶管理金鑰進行加密。開發人員需要確保應用程式在需要時可以解密資料。授予應用程式存取 KMS 金鑰的最安全方式是什麼？",
    options_en: [
      "A. Create an IAM user with permissions to use the KMS key. Store the user's access keys in the application code.",
      "B. Create an IAM role with permissions to use the KMS key. Assign the role to the AWS resource running the application.",
      "C. Store the KMS key ARN in AWS Systems Manager Parameter Store. Grant the application access to Parameter Store.",
      "D. Create a resource-based policy for the KMS key that allows access from any AWS principal."
    ],
    options_zh: [
      "A. 建立具有使用 KMS 金鑰許可的 IAM 使用者。將使用者的存取金鑰儲存在應用程式程式碼中。",
      "B. 建立具有使用 KMS 金鑰許可的 IAM 角色。將角色指派給執行應用程式的 AWS 資源。",
      "C. 將 KMS 金鑰 ARN 儲存在 AWS Systems Manager Parameter Store 中。授予應用程式存取 Parameter Store 的權限。",
      "D. 為 KMS 金鑰建立資源型政策，允許從任何 AWS 主體存取。"
    ],
    correct_answer: "B",
    explanation: "使用IAM角色是最安全的方式，因為它避免了在程式碼中硬編碼憑證的風險。IAM角色提供臨時憑證，會自動輪換，並且只能由指定的AWS資源承擔。這符合AWS安全最佳實踐，比使用長期存取金鑰更安全。",
    tips: [
      "避免在程式碼中硬編碼憑證",
      "IAM 角色提供臨時憑證",
      "角色會自動處理憑證輪換",
      "符合最小權限原則"
    ]
  },
  {
    question_number: 9,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A company needs to store user preferences for a mobile application. The preferences need to be synchronized across multiple devices for each user. The solution must support real-time synchronization and offline access. Which AWS service combination will meet these requirements MOST effectively?",
    question_text_zh: "一家公司需要為行動應用程式儲存使用者偏好設定。偏好設定需要在每個使用者的多個裝置間同步。解決方案必須支援即時同步和離線存取。哪個 AWS 服務組合最有效地滿足這些要求？",
    options_en: [
      "A. Amazon Cognito Sync with Amazon S3",
      "B. AWS AppSync with Amazon DynamoDB",
      "C. Amazon API Gateway with AWS Lambda and Amazon RDS",
      "D. Amazon ElastiCache with Amazon CloudFront"
    ],
    options_zh: [
      "A. Amazon Cognito Sync 搭配 Amazon S3",
      "B. AWS AppSync 搭配 Amazon DynamoDB",
      "C. Amazon API Gateway 搭配 AWS Lambda 和 Amazon RDS",
      "D. Amazon ElastiCache 搭配 Amazon CloudFront"
    ],
    correct_answer: "B",
    explanation: "AWS AppSync 搭配 DynamoDB 是最佳選擇，因為 AppSync 專門為行動應用提供即時資料同步功能，支援 GraphQL API，並具備內建的離線功能。DynamoDB 提供快速、可擴展的 NoSQL 資料庫，非常適合儲存使用者偏好設定。這個組合專門為行動應用的同步需求而設計。",
    tips: [
      "AppSync 專門用於行動應用資料同步",
      "支援 GraphQL 和即時訂閱",
      "內建離線同步功能",
      "DynamoDB 適合儲存結構化的使用者資料"
    ]
  },
  {
    question_number: 10,
    question_text_en: "[AWS Certified Developer - Associate DVA-C02] A developer is optimizing an application that processes images uploaded to Amazon S3. The application currently uses AWS Lambda functions to resize images synchronously when they are uploaded. Users are experiencing slow response times during peak usage periods. What is the MOST effective way to improve the application's performance and user experience?",
    question_text_zh: "開發人員正在最佳化處理上傳到 Amazon S3 的圖片的應用程式。應用程式目前使用 AWS Lambda 函數在圖片上傳時同步調整圖片大小。使用者在尖峰使用期間遇到回應時間緩慢的問題。改善應用程式效能和使用者體驗的最有效方式是什麼？",
    options_en: [
      "A. Increase the memory allocation for the Lambda functions",
      "B. Use Amazon SQS to queue image processing requests and process them asynchronously",
      "C. Replace Lambda with Amazon EC2 instances for image processing",
      "D. Store processed images in Amazon ElastiCache for faster retrieval"
    ],
    options_zh: [
      "A. 增加 Lambda 函數的記憶體配置",
      "B. 使用 Amazon SQS 將圖片處理請求排入佇列並非同步處理",
      "C. 將 Lambda 替換為 Amazon EC2 執行個體進行圖片處理",
      "D. 將處理過的圖片儲存在 Amazon ElastiCache 中以加快擷取速度"
    ],
    correct_answer: "B",
    explanation: "使用 Amazon SQS 進行非同步處理是最有效的解決方案。這樣可以立即回應使用者的上傳請求，而不需要等待圖片處理完成。SQS 可以緩衝請求，Lambda 函數可以並行處理佇列中的任務，大大改善了使用者體驗並提高了系統的可擴展性。",
    tips: [
      "非同步處理改善使用者體驗",
      "SQS 提供可靠的訊息佇列",
      "允許更好的負載分散",
      "避免在上傳時阻塞使用者操作"
    ]
  }
]

/**
 * 取得所有題目
 * @returns 題目陣列
 */
export function getAllQuestions(): Question[] {
  return questions
}

/**
 * 根據題目編號取得特定題目
 * @param questionNumber 題目編號
 * @returns 指定的題目或 undefined
 */
export function getQuestionByNumber(questionNumber: number): Question | undefined {
  return questions.find((q: Question) => q.question_number === questionNumber)
}

/**
 * 取得題目總數
 * @returns 題目總數
 */
export function getQuestionCount(): number {
  return questions.length
}