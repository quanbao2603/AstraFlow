/**
 * storyTxtParser.ts
 * Parse file .txt theo cấu trúc AstraFlow Story Template
 * thành Partial<StoryFormData> để auto-fill form.
 *
 * CẤU TRÚC FILE .TXT:
 * ─────────────────────────────────────────────────
 * # Comment — parser bỏ qua
 *
 * [CORE]
 * title: Tên truyện
 * theme: Chủ đề / mô tả ngắn
 * genre: Thể loại
 * setting: Bối cảnh chung
 *
 * [CHARACTER]
 * name: Tên nhân vật chính
 * gender: nam | nu | khac
 * bio: Tiểu sử / bối cảnh nhân vật
 *
 * [ADVANCED]
 * writingStyle: Phong cách viết
 * crueltyLevel: normal | hard | hell
 * aiInstructions: Hướng dẫn cho AI
 * allowNsfw: true | false
 *
 * [WORLD]
 * type: faction | name: Tên | description: Mô tả | conflict: Mâu thuẫn
 * type: location | name: Tên | description: Mô tả
 * ─────────────────────────────────────────────────
 */

import type { StoryFormData, WorldEntity } from '../../types/story';

export interface ParseResult {
  data: Partial<StoryFormData>;
  warnings: string[];
}

const VALID_GENDERS = ['nam', 'nu', 'khac'];
const VALID_CRUELTY = ['normal', 'hard', 'hell'];
const VALID_ENTITY_TYPES = ['faction', 'location', 'item', 'event'];

export function parseStoryTxt(content: string): ParseResult {
  const warnings: string[] = [];
  const result: Partial<StoryFormData> = {};
  const worldEntities: WorldEntity[] = [];

  let currentSection = '';
  let entityIdCounter = 1;

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // Bỏ qua dòng trống và comment
    if (!line || line.startsWith('#')) continue;

    // Detect section header [SECTION]
    const sectionMatch = line.match(/^\[([A-Z]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }

    // Parse key: value
    if (currentSection !== 'WORLD') {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.substring(0, colonIdx).trim().toLowerCase();
      const value = line.substring(colonIdx + 1).trim();
      if (!value) continue;

      switch (currentSection) {
        case 'CORE':
          if (key === 'title')   result.title   = value;
          if (key === 'theme')   result.theme   = value;
          if (key === 'genre')   result.genre   = value;
          if (key === 'setting') result.setting = value;
          break;

        case 'CHARACTER':
          if (key === 'name')   result.mcName = value;
          if (key === 'gender') {
            const g = value.toLowerCase();
            if (VALID_GENDERS.includes(g)) {
              result.mcGender = g;
            } else {
              warnings.push(`Dòng ${i + 1}: gender "${value}" không hợp lệ, dùng "nam", "nu" hoặc "khac". Đặt mặc định là "nam".`);
              result.mcGender = 'nam';
            }
          }
          if (key === 'bio') result.mcBio = value;
          break;

        case 'ADVANCED':
          if (key === 'writingstyle')    result.writingStyle    = value;
          if (key === 'cruelty_level' || key === 'crueltylevel') {
            const cl = value.toLowerCase();
            if (VALID_CRUELTY.includes(cl)) {
              result.crueltyLevel = cl;
            } else {
              warnings.push(`Dòng ${i + 1}: crueltyLevel "${value}" không hợp lệ, dùng "normal", "hard" hoặc "hell". Đặt mặc định là "normal".`);
              result.crueltyLevel = 'normal';
            }
          }
          if (key === 'aiinstructions' || key === 'ai_instructions') {
            result.aiInstructions = value;
          }
          if (key === 'allownsfw' || key === 'allow_nsfw') {
            result.allowNsfw = value.toLowerCase() === 'true';
          }
          break;
      }
    }

    // Parse [WORLD] entries — dùng pipe | phân tách
    if (currentSection === 'WORLD') {
      const entity = parseWorldEntityLine(line, entityIdCounter, i + 1, warnings);
      if (entity) {
        worldEntities.push(entity);
        entityIdCounter++;
      }
    }
  }

  if (worldEntities.length > 0) {
    result.worldEntities = worldEntities;
  }

  return { data: result, warnings };
}

function parseWorldEntityLine(
  line: string,
  id: number,
  lineNum: number,
  warnings: string[]
): WorldEntity | null {
  // Mỗi field cách nhau bởi |, format: key: value | key: value | ...
  const parts = line.split('|').map(p => p.trim());
  const fields: Record<string, string> = {};

  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx === -1) continue;
    const k = part.substring(0, colonIdx).trim().toLowerCase();
    const v = part.substring(colonIdx + 1).trim();
    fields[k] = v;
  }

  if (!fields['type'] && !fields['name']) {
    warnings.push(`Dòng ${lineNum}: Bỏ qua entity không có "type" hoặc "name".`);
    return null;
  }

  const type = (fields['type'] || 'faction').toLowerCase() as WorldEntity['type'];
  if (!VALID_ENTITY_TYPES.includes(type)) {
    warnings.push(`Dòng ${lineNum}: type "${type}" không hợp lệ, dùng "faction", "location", "item" hoặc "event". Đặt mặc định "faction".`);
  }

  return {
    id,
    type: VALID_ENTITY_TYPES.includes(type) ? type : 'faction',
    name: fields['name'] || '',
    description: fields['description'] || '',
    conflict: fields['conflict'] || '',
  };
}

/**
 * Tạo nội dung file template mẫu để user download
 */
export function generateTemplateContent(): string {
  return `# ╔══════════════════════════════════════════════╗
# ║     ASTRAFLOW STORY TEMPLATE v1.0           ║
# ║  Xóa hoặc giữ nguyên dòng comment (#)       ║
# ╚══════════════════════════════════════════════╝

[CORE]
title: Dấu Vài, Đa Nhân Cách
theme: Hành trình khám phá nội tâm và sự chấp nhận bản thân
genre: Tâm lý học, Kinh dị tâm lý
setting: Thành phố hiện đại, bệnh viện tâm thần bỏ hoang

[CHARACTER]
# gender: nam | nu | khac
name: Nguyễn Minh Khoa
gender: nam
bio: Cậu sinh viên 22 tuổi mắc chứng DID (Rối loạn đa nhân cách). Mồ côi từ nhỏ, lớn lên trong trại trẻ. Nhân cách thứ 2 - "Bóng Tối" - hung hãn và tàn nhẫn hơn nhiều.

[ADVANCED]
# writingStyle: Tông điệu văn phong
# crueltyLevel: normal | hard | hell
# allowNsfw: true | false
writingStyle: Kinh dị tâm lý, văn phong chậm rãi gây áp lực
crueltyLevel: hard
aiInstructions: Không để nhân vật chính chết trước chap 50. Giữ tone u tối xuyên suốt.
allowNsfw: false

[WORLD]
# Mỗi dòng là 1 thực thể, các field phân tách bởi ký tự |
# type: faction | location | item | event
type: location | name: Bệnh viện Tâm Thần Số 7 | description: Nơi bị bỏ hoang 20 năm, ẩn chứa bí mật về thí nghiệm tàn bạo | conflict: Nhân vật chính bị mắc kẹt tại đây mỗi khi nhân cách thứ 2 xuất hiện
type: faction | name: Nhóm Nghiên Cứu Bí Ẩn | description: Tổ chức bí mật theo dõi nhân vật chính từ trước | conflict: Họ muốn khai thác nhân cách thứ 2 như vũ khí
`;
}
