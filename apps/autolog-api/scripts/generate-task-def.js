const fs = require("fs")

const imageUri = process.argv[2] // 커맨드라인 인자
if (!imageUri) {
  console.error("이미지 URI를 인자로 전달하세요.")
  process.exit(1)
}

const taskDef = {
  family: "photo-blog-api-task",
  networkMode: "awsvpc",
  requiresCompatibilities: ["FARGATE"],
  cpu: "256",
  memory: "512",
  containerDefinitions: [
    {
      name: "photo-blog-api",
      image: imageUri,
      portMappings: [
        {
          containerPort: 4000,
          protocol: "tcp",
        },
      ],
      essential: true,
    },
  ],
}

fs.writeFileSync("ecs-task-def.json", JSON.stringify(taskDef, null, 2))
console.log("✔ ecs-task-def.json 생성 완료")
