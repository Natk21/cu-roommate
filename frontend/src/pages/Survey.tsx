import SurveyQuestion from "../components/SurveyQuestion";

const Survey = () => {
  return (
    <div>
      <SurveyQuestion
        question="Question 1"
        options={["Option 1", "Option 2", "Option 3"]}
      />
    </div>
  );
};

export default Survey;
