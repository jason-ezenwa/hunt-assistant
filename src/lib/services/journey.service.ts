import { JourneyModel, JourneyObject } from '@/lib/db/models/journey.model';
import { CreateJourneyInput, UpdateJourneyInput } from '@/lib/dtos/journeys/inputs.dto';
import { JourneyClient } from '@/lib/db/models/journey.model';

export class JourneyService {
  async create(data: CreateJourneyInput): Promise<JourneyClient> {
    const journey = await JourneyModel.create(data);
    const journeyObj = journey.toObject() as JourneyObject;
    return {
      _id: journeyObj._id.toString(),
      userId: journeyObj.userId,
      companyName: journeyObj.companyName,
      jobTitle: journeyObj.jobTitle,
      jobDescription: journeyObj.jobDescription,
      resumeFileName: journeyObj.resumeFileName,
      resumeText: journeyObj.resumeText,
      insights: journeyObj.insights,
      coverLetter: journeyObj.coverLetter,
      status: journeyObj.status,
      createdAt: journeyObj.createdAt.toISOString(),
      updatedAt: journeyObj.updatedAt.toISOString(),
    };
  }

  async findByUserId(userId: string): Promise<JourneyClient[]> {
    const journeys = await JourneyModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return journeys.map((journey) => ({
      _id: journey._id.toString(),
      userId: journey.userId,
      companyName: journey.companyName,
      jobTitle: journey.jobTitle,
      jobDescription: journey.jobDescription,
      resumeFileName: journey.resumeFileName,
      resumeText: journey.resumeText,
      insights: journey.insights,
      coverLetter: journey.coverLetter,
      status: journey.status,
      createdAt: journey.createdAt.toISOString(),
      updatedAt: journey.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<JourneyClient | null> {
    const journey = await JourneyModel.findById(id).lean();
    if (!journey) return null;

    return {
      _id: journey._id.toString(),
      userId: journey.userId,
      companyName: journey.companyName,
      jobTitle: journey.jobTitle,
      jobDescription: journey.jobDescription,
      resumeFileName: journey.resumeFileName,
      resumeText: journey.resumeText,
      insights: journey.insights,
      coverLetter: journey.coverLetter,
      status: journey.status,
      createdAt: journey.createdAt.toISOString(),
      updatedAt: journey.updatedAt.toISOString(),
    };
  }

  async update(
    id: string,
    data: UpdateJourneyInput
  ): Promise<JourneyClient | null> {
    const journey = await JourneyModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!journey) return null;

    return {
      _id: journey._id.toString(),
      userId: journey.userId,
      companyName: journey.companyName,
      jobTitle: journey.jobTitle,
      jobDescription: journey.jobDescription,
      resumeFileName: journey.resumeFileName,
      resumeText: journey.resumeText,
      insights: journey.insights,
      coverLetter: journey.coverLetter,
      status: journey.status,
      createdAt: journey.createdAt.toISOString(),
      updatedAt: journey.updatedAt.toISOString(),
    };
  }

  async delete(id: string): Promise<void> {
    await JourneyModel.findByIdAndDelete(id);
  }
}

export const journeyService = new JourneyService();
