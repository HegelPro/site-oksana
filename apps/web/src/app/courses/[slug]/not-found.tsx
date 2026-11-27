import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function CourseNotFound() {
  return (
    <Container className="min-h-90 py-16">
      <h1 className="mb-6 text-[length:clamp(42px,8vw,68px)] text-plum">Курс не найден</h1>
      <ButtonLink href="/courses">Ко всем курсам</ButtonLink>
    </Container>
  );
}
