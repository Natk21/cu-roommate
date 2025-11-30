import SurveyQuestion from "../components/SurveyQuestion";

const Survey = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <SurveyQuestion
        question="Question 1"
        options={["Option 1", "Option 2", "Option 3"]}
      />
    </div>
  );
};

export default Survey;
