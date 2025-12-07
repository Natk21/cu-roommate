import { UserMatchingInfo } from "../services/surveyService";

const generateLookingForPoints = (surveyData: UserMatchingInfo) => {
  const points: string[] = [];

  if (surveyData.sleepScheduleImportance && surveyData.sleepScheduleImportance >= 4) {
    if (surveyData.bedtime === "Before 11 PM" && surveyData.wakeUpTime === "Before 10 AM") {
      points.push("morning person");
    } else if (surveyData.bedtime === "Before 3 AM") {
      points.push("night owl");
    }
  }

  if (surveyData.cleanlinessMatchImportance && surveyData.cleanlinessMatchImportance >= 4) {
    if (surveyData.cleanliness === "Very tidy (everything in place)") {
      points.push("very clean roommate");
    }
  }

  if (surveyData.workloadMatchImportance && surveyData.workloadMatchImportance >= 4) {
    if (surveyData.workloadStyle === "Academic grind") {
      points.push("wants serious studier");
    } else if (surveyData.workloadStyle === "Balanced") {
      points.push("wants balanced lifestyle");
    } else if (surveyData.workloadStyle === "Light/stress-free") {
      points.push("wants relaxed approach to academics");
    }
  }

  if (surveyData.musicPreferenceImportance && surveyData.musicPreferenceImportance >= 4) {
    if (surveyData.musicPreference === "No music out loud") {
      points.push("quiet environment");
    } else if (surveyData.musicPreference === "Music is always playing") {
      points.push("wants music-loving roommate");
    }
  }

  if (surveyData.noiseToleranceLevel !== null && surveyData.noiseToleranceLevel !== undefined) {
    if (surveyData.noiseToleranceLevel === 1) {
      points.push("very quiet space");
    } else if (surveyData.noiseToleranceLevel === 5) {
      points.push("ok with noise");
    }
  }

  if (surveyData.genderPreference === "my gender" && surveyData.gender) {
    points.push(`requires ${surveyData.gender} roommate`);
  }

  if (surveyData.hobbies) {
    const hobbiesLower = surveyData.hobbies.toLowerCase();

    if (hobbiesLower.includes("gym") || hobbiesLower.includes("fitness") || hobbiesLower.includes("workout")) {
      points.push("gym enthusiast");
    }

    if (hobbiesLower.includes("game") || hobbiesLower.includes("gaming") || hobbiesLower.includes("video game")) {
      points.push("enjoys gaming");
    }

    if (hobbiesLower.includes("music") || hobbiesLower.includes("instrument") || hobbiesLower.includes("band")) {
      points.push("loves music");
    }

    if (hobbiesLower.includes("sport") || hobbiesLower.includes("athletic") || hobbiesLower.includes("team")) {
      points.push("athletic/sporty");
    }

    if (hobbiesLower.includes("cook") || hobbiesLower.includes("baking") || hobbiesLower.includes("food")) {
      points.push("enjoys cooking");
    }

    if (hobbiesLower.includes("read") || hobbiesLower.includes("book")) {
      points.push("loves reading");
    }

    if (hobbiesLower.includes("social") || hobbiesLower.includes("party") || hobbiesLower.includes("going out")) {
      points.push("social butterfly");
    }
  }

  return points.slice(0, 3);
};

export default generateLookingForPoints;
