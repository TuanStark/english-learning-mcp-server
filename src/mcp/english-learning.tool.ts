import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnglishLearningTool {
  constructor(private readonly prisma: PrismaService) {}

  @Tool({
    name: 'get_vocabulary_by_topic',
    description: 'Lấy danh sách từ vựng theo chủ đề',
    parameters: z.object({
      topic_id: z.number().optional().describe('ID của chủ đề từ vựng (tùy chọn)'),
      topic_name: z.string().optional().describe('Tên chủ đề từ vựng (tùy chọn)'),
      difficulty_level: z.enum(['Easy', 'Medium', 'Hard']).optional().describe('Mức độ khó'),
      limit: z.number().optional().default(20).describe('Số lượng từ vựng trả về (mặc định 20)'),
    }),
  })
  async getVocabularyByTopic({ topic_id, topic_name, difficulty_level, limit = 20 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      let whereCondition: any = { isActive: true };

      if (topic_id) {
        whereCondition.topicId = topic_id;
      } else if (topic_name) {
        whereCondition.topic = {
          topicName: {
            contains: topic_name,
            mode: 'insensitive'
          }
        };
      }

      if (difficulty_level) {
        whereCondition.difficultyLevel = difficulty_level;
      }

      const vocabulary = await this.prisma.vocabulary.findMany({
        where: whereCondition,
        include: {
          topic: true,
          examples: true,
        },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              vocabulary,
              total_found: vocabulary.length,
              search_criteria: { topic_id, topic_name, difficulty_level, limit },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy từ vựng: ${error.message}`);
    }
  }

  @Tool({
    name: 'get_grammar_lessons',
    description: 'Lấy danh sách bài học ngữ pháp',
    parameters: z.object({
      difficulty_level: z.enum(['Easy', 'Medium', 'Hard']).optional().describe('Mức độ khó'),
      limit: z.number().optional().default(10).describe('Số lượng bài học trả về (mặc định 10)'),
    }),
  })
  async getGrammarLessons({ difficulty_level, limit = 10 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      let whereCondition: any = { isActive: true };

      if (difficulty_level) {
        whereCondition.difficultyLevel = difficulty_level;
      }

      const grammar = await this.prisma.grammar.findMany({
        where: whereCondition,
        include: {
          examples: true,
        },
        take: limit,
        orderBy: { orderIndex: 'asc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              grammar_lessons: grammar,
              total_found: grammar.length,
              search_criteria: { difficulty_level, limit },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy bài học ngữ pháp: ${error.message}`);
    }
  }

  @Tool({
    name: 'get_exams',
    description: 'Lấy danh sách bài thi',
    parameters: z.object({
      exam_type: z.string().optional().describe('Loại bài thi (VD: TOEIC, IELTS)'),
      difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional().describe('Mức độ khó'),
      limit: z.number().optional().default(10).describe('Số lượng bài thi trả về (mặc định 10)'),
    }),
  })
  async getExams({ exam_type, difficulty, limit = 10 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      let whereCondition: any = { isActive: true };

      if (exam_type) {
        whereCondition.type = exam_type;
      }

      if (difficulty) {
        whereCondition.difficulty = difficulty;
      }

      const exams = await this.prisma.exam.findMany({
        where: whereCondition,
        include: {
          questions: {
            include: {
              answerOptions: true,
            },
            take: 5, // Chỉ lấy 5 câu hỏi đầu tiên để preview
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              exams,
              total_found: exams.length,
              search_criteria: { exam_type, difficulty, limit },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy bài thi: ${error.message}`);
    }
  }

  @Tool({
    name: 'get_learning_paths',
    description: 'Lấy danh sách lộ trình học tập',
    parameters: z.object({
      target_level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional().describe('Mức độ mục tiêu'),
      limit: z.number().optional().default(5).describe('Số lượng lộ trình trả về (mặc định 5)'),
    }),
  })
  async getLearningPaths({ target_level, limit = 5 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      let whereCondition: any = { isActive: true };

      if (target_level) {
        whereCondition.targetLevel = target_level;
      }

      const learningPaths = await this.prisma.learningPath.findMany({
        where: whereCondition,
        include: {
          pathSteps: {
            orderBy: { orderIndex: 'asc' }
          },
        },
        take: limit,
        orderBy: { orderIndex: 'asc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              learning_paths: learningPaths,
              total_found: learningPaths.length,
              search_criteria: { target_level, limit },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy lộ trình học tập: ${error.message}`);
    }
  }

  @Tool({
    name: 'get_vocabulary_topics',
    description: 'Lấy danh sách chủ đề từ vựng',
    parameters: z.object({
      limit: z.number().optional().default(20).describe('Số lượng chủ đề trả về (mặc định 20)'),
    }),
  })
  async getVocabularyTopics({ limit = 20 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      const topics = await this.prisma.vocabularyTopic.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { vocabularies: true }
          }
        },
        take: limit,
        orderBy: { orderIndex: 'asc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              topics,
              total_found: topics.length,
              search_criteria: { limit },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy chủ đề từ vựng: ${error.message}`);
    }
  }

  @Tool({
    name: 'get_blog_posts',
    description: 'Lấy danh sách bài viết blog',
    parameters: z.object({
      category_id: z.number().optional().describe('ID danh mục blog'),
      status: z.enum(['Draft', 'Published', 'Archived']).optional().default('Published').describe('Trạng thái bài viết'),
      limit: z.number().optional().default(10).describe('Số lượng bài viết trả về (mặc định 10)'),
    }),
  })
  async getBlogPosts({ category_id, status = 'Published', limit = 10 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      let whereCondition: any = { status };

      if (category_id) {
        whereCondition.categoryId = category_id;
      }

      const blogPosts = await this.prisma.blogPost.findMany({
        where: whereCondition,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
            }
          },
          category: true,
          _count: {
            select: { comments: true }
          }
        },
        take: limit,
        orderBy: { publishedAt: 'desc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              blog_posts: blogPosts,
              total_found: blogPosts.length,
              search_criteria: { category_id, status, limit },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy bài viết blog: ${error.message}`);
    }
  }

  @Tool({
    name: 'search_vocabulary',
    description: 'Tìm kiếm từ vựng theo từ khóa',
    parameters: z.object({
      keyword: z.string().describe('Từ khóa tìm kiếm (tiếng Anh hoặc tiếng Việt)'),
      limit: z.number().optional().default(20).describe('Số lượng kết quả trả về (mặc định 20)'),
    }),
  })
  async searchVocabulary({ keyword, limit = 20 }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      const vocabulary = await this.prisma.vocabulary.findMany({
        where: {
          isActive: true,
          OR: [
            {
              englishWord: {
                contains: keyword,
                mode: 'insensitive'
              }
            },
            {
              vietnameseMeaning: {
                contains: keyword,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          topic: true,
          examples: true,
        },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              vocabulary,
              total_found: vocabulary.length,
              search_keyword: keyword,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm từ vựng: ${error.message}`);
    }
  }

  @Tool({
    name: 'get_user_progress',
    description: 'Lấy tiến độ học tập của người dùng',
    parameters: z.object({
      user_id: z.number().describe('ID của người dùng'),
      progress_type: z.enum(['vocabulary', 'grammar', 'exam']).optional().describe('Loại tiến độ cần lấy'),
    }),
  })
  async getUserProgress({ user_id, progress_type }, context: Context) {
    await context.reportProgress({ progress: 25, total: 100 });

    try {
      let result: any = {};

      if (!progress_type || progress_type === 'vocabulary') {
        const vocabProgress = await this.prisma.userVocabularyProgress.findMany({
          where: { userId: user_id },
          include: {
            vocabulary: {
              include: {
                topic: true
              }
            }
          },
          orderBy: { lastPracticedAt: 'desc' }
        });
        result.vocabulary_progress = vocabProgress;
      }

      if (!progress_type || progress_type === 'grammar') {
        const grammarProgress = await this.prisma.userGrammarProgress.findMany({
          where: { userId: user_id },
          include: {
            grammar: true
          },
          orderBy: { lastPracticedAt: 'desc' }
        });
        result.grammar_progress = grammarProgress;
      }

      if (!progress_type || progress_type === 'exam') {
        const examAttempts = await this.prisma.examAttempt.findMany({
          where: { userId: user_id },
          include: {
            exam: true
          },
          orderBy: { completedAt: 'desc' }
        });
        result.exam_attempts = examAttempts;
      }

      await context.reportProgress({ progress: 100, total: 100 });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              user_id,
              progress: result,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy tiến độ người dùng: ${error.message}`);
    }
  }
}
