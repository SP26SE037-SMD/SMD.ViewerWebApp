import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_ENDPOINT || "";

const MOCK_CURRICULUM_DETAIL = {
  curriculumId: "1",
  curriculumCode: "BIT_SE_K19D_K20A",
  curriculumName: "The Bachelor Program of Information Technology, Software Engineering Major (Chương trình cử nhân ngành CNTT, chuyên ngành Kỹ thuật phần mềm)",
  englishName: "The Bachelor Program of Information Technology, Software Engineering Major",
  description: `1. Mục tiêu đào tạo
1.1 Mục tiêu chung:
Đào tạo cử nhân ngành Công nghệ thông tin (CNTT) chuyên ngành Kỹ thuật phần mềm (KTPM) có nhân cách và năng lực đáp ứng nhu cầu thực tế của xã hội; nắm vững kiến thức chuyên môn và thực hành, có khả năng tổ chức, thực hiện và phát huy sáng tạo trong các công việc liên quan đến các chuyên ngành KTPM được đào tạo; có khả năng theo đuởi việc học tập, nghiên cứu ở bậc học cao hơn. Chương trình đào tạo chuyên ngành KTPM có định hướng ứng dụng.
Chương trình đào tạo nhằm:
a) Trang bị cho sinh viên kiến thức cơ bản của ngành CNTT cùng các phương pháp luận, công nghệ nền tảng và chuyên sâu của chuyên ngành;
b) Rèn luyện cho sinh viên những đức tính, kỹ năng cần thiết qua môi trường làm việc chuyên nghiệp, biết vận dụng các kiến thức ngành CNTT và các kiến thức chuyên ngành vào công việc thực tế;
c) Cung cấp cho sinh viên một nền tảng vững chắc về ngoại ngữ, khoa học, văn hóa, xã hội, phát huy tính chủ động, sáng tạo trong học tập, công việc và cuộc sống.

1.2 Mục tiêu cụ thể:

1.3 Vị trí việc làm sau khi tốt nghiệp:
Sinh viên tốt nghiệp chuyên ngành Kỹ thuật phần mềm có thể lựa chọn cho mình những công việc như:
+ Lập trình viên phát triển ứng dụng;
+ Chuyên viên phân tích nghiệp vụ;
+ Kỹ sư đảm bảo chất lượng phần mềm;
+ Kỹ sư quy trình sản xuất phần mềm;
+ Quản trị viên dự án phần mềm.

2. Chuẩn đầu ra chuyên ngành Kỹ thuật phần mềm

3. Khối lượng kiến thức toàn khóa: 145 tín chỉ, chưa kể Tiếng Anh chuẩn bị, Giáo dục Quốc phòng, các hoạt động rèn luyện bắt buộc và tự chọn.

4. Đối tượng tuyển sinh
- Theo quy chế tuyển sinh đại học, cao đẳng hệ chính quy của Bộ Giáo dục và Đào tạo.
- Theo quy chế tuyển sinh của trường Đại học FPT.

5. Quy trình đào tạo, điều kiện tốt nghiệp
Quy trình đào tạo và điều kiện tốt nghiệp được quy định theo "Quy chế đào tạo hệ đại học chính quy theo hệ thống tín chỉ" hiện hành của Đại học FPT.

6. Cách thức đánh giá
Cách thức đánh giá được quy định theo "Quy chế đào tạo hệ đại học chính quy theo hệ thống tín chỉ" hiện hành của Đại học FPT.`,
  decisionNo: "233/QĐ-ĐHFPT dated 03/11/2026",
  totalCredits: 145,
  totalSubjects: 48,
  startYear: 2024,
  status: "ACTIVE",
  plos: [
    { ploName: "PLO1", ploDescription: "Understand basic knowledge of social sciences, political law, national security and defense, contributing to the formation of a scientific worldview and methodology." },
    { ploName: "PLO2", ploDescription: "Apply solid scientific foundation knowledge in the field of information technology in general and software engineering in particular to understand the professional context and acquire in-depth specialized knowledge of software engineering." },
    { ploName: "PLO3", ploDescription: "Apply in-depth specialized knowledge, new technologies in the field of software engineering, or expanded knowledge (in fields close to software engineering) to work and propose solutions to meet diverse needs from reality." },
    { ploName: "PLO4", ploDescription: "Have basic knowledge of planning and operating, implementing, and supervising the implementation of plans for specialized work in the field of software engineering." },
    { ploName: "PLO5", ploDescription: "Have a mindset about startups and apply startup knowledge and skills to implement a startup project; have creative thinking, research skills, critical thinking and problem solving." },
    { ploName: "PLO6", ploDescription: "Have intermediate English proficiency equivalent to level 4 according to the 6-level foreign language competency framework for Vietnam, and be able to communicate simply in Japanese." },
    { ploName: "PLO7", ploDescription: "Have the ability to communicate and present to clearly state the problem to be solved and convey knowledge and skills when performing specific/complex professional tasks related to software engineering." },
    { ploName: "PLO8", ploDescription: "Have the ability to program and use analysis, design, construction/implementation, and testing tools in the field of software engineering." },
    { ploName: "PLO9", ploDescription: "Have the ability to update and exploit advanced tools and techniques in the field of software engineering in particular and information technology in general." },
    { ploName: "PLO10", ploDescription: "Develop the ability to work independently as well as work effectively in a team in an academic and practical environment; take personal responsibility and responsibility for the team when performing a professional job. Have the spirit of self-study, lifelong learning, adapt to the continuous changes of technology and society." },
    { ploName: "PLO11", ploDescription: "Behave professionally, ethically, socially responsible and have a spirit of serving the community; have professional responsibility and integrity in work." },
    { ploName: "PLO12", ploDescription: "Be mentally and physically strong, demonstrate national identity, and be confident in international integration." },
    { ploName: "PLO13", ploDescription: "Be able to plan, coordinate, and manage resources related to software engineering projects; guide and supervise the implementation of project tasks and at the same time, be able to evaluate the effectiveness of the project and propose feasible and effective solutions for improvement." },
  ],
  subjects: [
    { subjectCode: "OTP101", subjectName: "Orientation and General Training Program_Định hướng và Rèn luyện tập trung", semester: 0, noCredit: 0, preRequisite: "None" },
    { subjectCode: "PEN", subjectName: "Preparation English_Tiếng Anh chuẩn bị", semester: 0, noCredit: 0, preRequisite: "" },
    { subjectCode: "PHE_COM*1", subjectName: "Physical Education 1_Giáo dục thể chất 1", semester: 0, noCredit: 2, preRequisite: "" },
    { subjectCode: "TMI_ELE", subjectName: "Traditional musical instrument_Nhạc cụ truyền thống", semester: 0, noCredit: 3, preRequisite: "" },
    { subjectCode: "CEA201", subjectName: "Computer Organization and Architecture_Tổ chức và Kiến trúc máy tính", semester: 1, noCredit: 3, preRequisite: "" },
    { subjectCode: "CSI106", subjectName: "Introduction to Computer Science_Nhập môn khoa học máy tính", semester: 1, noCredit: 3, preRequisite: "" },
    { subjectCode: "MAE101", subjectName: "Mathematics for Engineering_Toán cho ngành kỹ thuật", semester: 1, noCredit: 3, preRequisite: "None" },
    { subjectCode: "PHE_COM*2", subjectName: "Physical Education 2_Giáo dục thể chất 2", semester: 1, noCredit: 2, preRequisite: "" },
    { subjectCode: "PRF192", subjectName: "Programming Fundamentals_Cơ sở lập trình", semester: 1, noCredit: 3, preRequisite: "None" },
    { subjectCode: "SSL101c", subjectName: "Academic Skills for University Success_Kỹ năng học tập đại học", semester: 1, noCredit: 3, preRequisite: "None" },
    { subjectCode: "MAD101", subjectName: "Discrete mathematics_Toán rời rạc", semester: 2, noCredit: 3, preRequisite: "None" },
    { subjectCode: "NWC204", subjectName: "Computer Networking_Mạng máy tính", semester: 2, noCredit: 3, preRequisite: "" },
    { subjectCode: "OSG202", subjectName: "Operating Systems_Hệ điều hành", semester: 2, noCredit: 3, preRequisite: "" },
    { subjectCode: "PHE_COM*3", subjectName: "Physical Education 3_Giáo dục thể chất 3", semester: 2, noCredit: 2, preRequisite: "" },
    { subjectCode: "PRO192", subjectName: "Object-Oriented Programming_Lập trình hướng đối tượng", semester: 2, noCredit: 3, preRequisite: "Pass PRF192" },
    { subjectCode: "WED201c", subjectName: "Web Design_Thiết kế web", semester: 2, noCredit: 3, preRequisite: "None" },
    { subjectCode: "CSD201", subjectName: "Data Structures and Algorithms_Cấu trúc dữ liệu và giải thuật", semester: 3, noCredit: 3, preRequisite: "PRO192" },
    { subjectCode: "DBI202", subjectName: "Introduction to Databases_Các hệ cơ sở dữ liệu", semester: 3, noCredit: 3, preRequisite: "" },
    { subjectCode: "JPD113", subjectName: "Elementary Japanese 1- A1.1_Tiếng Nhật sơ cấp 1-A1.1", semester: 3, noCredit: 3, preRequisite: "Không" },
    { subjectCode: "LAB211", subjectName: "OOP with Java Lab_Thực hành OOP với Java", semester: 3, noCredit: 3, preRequisite: "PRO192" },
    { subjectCode: "MAS291", subjectName: "Statistics & Probability_Xác suất thống kê", semester: 3, noCredit: 3, preRequisite: "MAE101 or MAC101" },
    { subjectCode: "IOT102", subjectName: "Internet of Things_Internet vạn vật", semester: 4, noCredit: 3, preRequisite: "" },
    { subjectCode: "JPD123", subjectName: "Elementary Japanese 1-A1.2_Tiếng Nhật sơ cấp 1-A1.2", semester: 4, noCredit: 3, preRequisite: "JPD113" },
    { subjectCode: "PRJ301", subjectName: "Java Web Application Development_Phát triển ứng dụng Java web", semester: 4, noCredit: 3, preRequisite: "DBI202, PRO192" },
    { subjectCode: "SSG104", subjectName: "Communication and In-Group Working Skills_Kỹ năng giao tiếp và cộng tác", semester: 4, noCredit: 3, preRequisite: "None" },
    { subjectCode: "SWE202c", subjectName: "Introduction to Software Engineering_Nhập môn kĩ thuật phần mềm", semester: 4, noCredit: 3, preRequisite: "PRO192" },
    { subjectCode: "SE_COM*1", subjectName: "Subject 1 of Combo*_Học phần 1 của combo*", semester: 5, noCredit: 3, preRequisite: "" },
    { subjectCode: "SWP391", subjectName: "Software development project_Dự án phát triển phần mềm", semester: 5, noCredit: 3, preRequisite: "PRJ301, SWE201c, pass LAB211" },
    { subjectCode: "SWR302", subjectName: "Software Requirement_Yêu cầu phần mềm", semester: 5, noCredit: 3, preRequisite: "SWE102 or SWE201c" },
    { subjectCode: "SWT301", subjectName: "Software Testing_Kiểm thử phần mềm", semester: 5, noCredit: 3, preRequisite: "SWE102 or SWE201c" },
    { subjectCode: "WDU203c", subjectName: "UI/UX Design_Thiết kế trải nghiệm người dùng", semester: 5, noCredit: 3, preRequisite: "" },
    { subjectCode: "ENW493c", subjectName: "Research Methods & Academic Writing Skills_Phương pháp nghiên cứu & Kỹ năng viết học thuật", semester: 6, noCredit: 3, preRequisite: "" },
    { subjectCode: "OJT202", subjectName: "On-The-Job Training_Đào tạo trong môi trường thực tế", semester: 6, noCredit: 10, preRequisite: "Students attained 90% of the total credits prior to the OJT term" },
    { subjectCode: "EXE101", subjectName: "Experiential Entrepreneurship 1_Trải nghiệm khởi nghiệp 1", semester: 7, noCredit: 3, preRequisite: "None" },
    { subjectCode: "PMG201c", subjectName: "Project Management_Quản lý dự án", semester: 7, noCredit: 3, preRequisite: "None" },
    { subjectCode: "SE_COM*2", subjectName: "Subject 2 of Combo*_Học phần 2 của combo*", semester: 7, noCredit: 3, preRequisite: "" },
    { subjectCode: "SE_COM*3", subjectName: "Subject 3 of Combo*_Học phần 3 của combo*", semester: 7, noCredit: 3, preRequisite: "" },
    { subjectCode: "SWD392", subjectName: "Software Architecture and Design_Kiến trúc và thiết kế phần mềm", semester: 7, noCredit: 3, preRequisite: "SWE201c, PRO192" },
    { subjectCode: "EXE201", subjectName: "Experiential Entrepreneurship 2_Trải nghiệm khởi nghiệp 2", semester: 8, noCredit: 3, preRequisite: "EXE101" },
    { subjectCode: "ITE302c", subjectName: "Ethics in IT_Đạo đức trong CNTT", semester: 8, noCredit: 3, preRequisite: "None" },
    { subjectCode: "MLN111", subjectName: "Philosophy of Marxism – Leninism_Triết học Mác - Lê-nin", semester: 8, noCredit: 3, preRequisite: "None" },
    { subjectCode: "MLN122", subjectName: "Political economics of Marxism – Leninism_Kinh tế chính trị Mác - Lê-nin", semester: 8, noCredit: 2, preRequisite: "None" },
    { subjectCode: "PRM393", subjectName: "Mobile Programming_Lập trình di động", semester: 8, noCredit: 3, preRequisite: "PRO192" },
    { subjectCode: "SE_COM*4_ELE", subjectName: "Học phần 4 của combo SE", semester: 8, noCredit: 3, preRequisite: "" },
    { subjectCode: "HCM202", subjectName: "Ho Chi Minh Ideology_Tư tưởng Hồ Chí Minh", semester: 9, noCredit: 2, preRequisite: "MLN111, MLN122" },
    { subjectCode: "MLN131", subjectName: "Scientific socialism_Chủ nghĩa xã hội khoa học", semester: 9, noCredit: 2, preRequisite: "MLN111, MLN122" },
    { subjectCode: "SE_GRA_ELE", subjectName: "Graduation Elective - Software Engineering_Học phần lựa chọn Đồ án tốt nghiệp chuyên ngành Kỹ thuật phần mềm", semester: 9, noCredit: 10, preRequisite: "" },
    { subjectCode: "VNR202", subjectName: "History of Communist Party of Vietnam_Lịch sử Đảng Cộng sản Việt Nam", semester: 9, noCredit: 2, preRequisite: "MLN111, MLN122" },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  // Try real backend first
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;

    const res = await fetch(`${BACKEND_URL}/curriculums/${id}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      return Response.json(data, { status: 200 });
    }
  } catch {
    // Backend unavailable — fall through to mock data
  }

  // Return mock data
  return Response.json({
    status: 200,
    message: "OK (mock data)",
    data: { ...MOCK_CURRICULUM_DETAIL, curriculumId: id },
  });
}
