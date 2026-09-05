# SOCRATES 项目页面内容设计

## 目标与范围

将现有 `/projects/socrates/` 占位介绍更新为面向个人网站访客的中英文研究故事，默认英文，沿用当前研究页模板和语言切换。时间维持 2026 年 3 月至 8 月；首页时间线只保留简短摘要，不展开全文。

用户已确认采用「研究故事＋关键图表」方向。纯论文摘要适合专业读者但缺少过程；直接放整张海报在手机上难以阅读，因此本次采用分节文字与独立图表。不增加新的导航、画廊交互或网站框架。

## 页面叙事

1. **研究问题与动机**：人类和语言模型报告的信心如何对应答案正确性？为什么准确率之外还需要关注信心与不确定性？
2. **项目角色与研究过程**：依据项目记录介绍独立研究背景，以及题库、问卷与模型评测、分析和研究展示的项目流程。个人贡献与整个项目产物分开描述；不把文件的存在推断为作者独自完成全部工作，不添加未经确认的职责或导师身份。
3. **实验设计**：400 道判断题、四类题型、五档信心报告、每题四次模型采样；46 名人类参与者、1,647 条有效回答、20 个模型配置。明确人类答中文、模型答英文，不能称为完全相同的实验条件。
4. **关键发现**：以少量可核验数字和通俗解释说明准确率、信心与错误的关系，以及虚构题上的表现。模型结论只限本题库和实际被测配置。
5. **局限与反思**：语言差异、模型准确率天花板、样本范围，以及行为指标与内部机制之间的解释边界。
6. **What I Can Do Next / 下一步探索**：按用户补充，列出以下三项未来计划。它们不属于当前研究成果，也不代表授权执行新实验或修改原始研究文件。

### 下一步探索：双语文案方向

- **Investigate AI hallucinations / 继续研究 AI 幻觉**
  - EN: Investigate when AI systems produce unsupported answers and how their reported confidence relates to those errors.
  - 中：继续研究 AI 何时会生成缺乏依据的回答，以及它表达的信心与这些错误之间的关系。
- **Improve the experimental design / 改进实验设计**
  - EN: Explore a follow-up task in which respondents answer first and then explain their reasoning, to examine whether a correct answer is supported by understanding. The explanation-scoring criteria still need to be developed; a fluent explanation alone would not establish understanding.
  - 中：探索让作答者先答题、再解释答案的后续任务，考察正确回答是否有理解作为支撑。解释的评价标准仍需设计，不能仅凭解释流畅就认定真正理解。
- **Build and connect at a Stanford hackathon / 在斯坦福 hackathon 中实践与交流**
  - EN: Aim to participate in a hackathon at Stanford, build alongside others, and meet more people with shared interests.
  - 中：计划参加在斯坦福举办的 hackathon，和其他参与者一起动手实践，认识更多志同道合的人。

不添加尚未提供的赛事名称、日期、录取或报名状态，也不暗示斯坦福学籍、任职或正式合作关系。

## 素材与证据

来源目录只读：`/Users/xinlu/Desktop/EAI Project/`。

- 数值依据：`experiment/results/analysis/stats_digest.md`，必要时核对无个体信息的聚合统计文件。
- 叙事和公开范围依据：`memory.md` 与已提交的 `README.md`。
- 论文索引中的 `papers/Final_Paper_EN.md` 当前未找到；目录中存在 `Final_Paper_EN.docx`。实施时核对相关论文段落，不假定旧索引文件仍存在。
- 若论文、摘要与图注出现解释口径差异，采用较窄的描述性结论，保留数值的适用范围；不能自行补做实验或更改研究结论。

计划使用 `experiment/results/figures/` 中四张已跟踪的聚合图：

| 图 | 放置与说明 |
| --- | --- |
| `c_accuracy_by_type.png` | 按题型结果：说明整体幻觉题包含虚构与真实冷僻条目，不混同虚构子集 |
| `c_mratio.png` | 信心与对错的关系：仅解释有足够错误的可估组，附指标含义和局限；不据此断言内部元认知存在或不存在 |
| `c_hallucination_acc.png` | 虚构条目结果：区别于整个幻觉题类别，说明人类回答偏向和判别力的区别 |
| `c_errors_ceiling.png` | 测量边界：错误太少意味着信息不足，不能将接近满分当成强元认知证据 |

保留当前示意封面，将研究图表放在正文对应段落，避免时间线小图上的统计文字无法阅读。图表使用独立单列展示、完整比例及可点击的清晰大图；保留原图文字，配中英文解释、替代文本及指标释义。不裁掉坐标、图例或置信区间，不用生成式编辑改动研究图。

## 文件与展示约束

- 修改 SOCRATES 的 `en.md`、`zh.md`，只在确有需要时调整该页的图表样式；不重构共享布局。
- 图表副本放入网站 `public/images/socrates/`，不复制整个研究目录。
- 增加来源记录，列出原图路径、图注依据和网页素材映射。
- 绝不复制参与者问卷、姓名、个体回答、API 密钥或整个数据集；不提供未经另行批准的论文、海报或答辩材料下载。
- 原始研究文件保持不变。本次先完成本地预览，不自动推送 GitHub。

## 验收

- 内容校验、单元测试、正式构建和端到端测试通过。
- 在桌面和手机检查英文与中文正文、四张图加载、图中文字完整及无横向溢出。
- 图片链接可打开清晰版本，图片具备尺寸、替代文本与适当的延迟加载。
- 对照来源复核数字、分母、虚构子集与整类题目的区别、语言局限和天花板说明。
- 暂存范围不包含任何原始研究目录或私人数据；用户审阅本地页面后再决定是否发布。
