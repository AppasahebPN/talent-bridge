module.exports = (employee) => {
  return `
You are an HR Succession Planning Expert for POWERGRID.

Employee Name: ${employee.name}

Current Role: ${employee.designation}

Target Role: ${employee.targetRole}

Department: ${employee.department}

Experience: ${employee.experience} Years

Generate:

1. Readiness Summary
2. Competency Gaps
3. Training Recommendations
4. Certifications
5. Mentor Recommendation
6. Job Rotation Recommendation
7. Timeline

Return the response in markdown.
`;
};