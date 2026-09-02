import { NextRequest, NextResponse } from 'next/server';
import { submitHousingRecord, isValidHkStudentEmail, SubmissionPayload } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body: SubmissionPayload = await request.json();

    if (!body.studentEmail || !isValidHkStudentEmail(body.studentEmail)) {
      return NextResponse.json(
        { success: false, message: '请使用有效的香港高校学生邮箱 (*.edu.hk) 进行身份校验' },
        { status: 400 }
      );
    }

    if (!body.communityName) {
      return NextResponse.json(
        { success: false, message: '居住小区名称为必填项' },
        { status: 400 }
      );
    }

    const result = await submitHousingRecord(body);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Submission route error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Server error' },
      { status: 500 }
    );
  }
}
