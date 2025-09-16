
import { z } from "zod";
import { format } from "date-fns";

import { visitorRegistrationSchema } from "./schemas";
import type { Visitor, UserRole } from "@/types";

export function addVisitor(visitors: Visitor[], values: z.infer<typeof visitorRegistrationSchema>): { newVisitor?: Visitor, error?: string } {
    const newVisitor: Visitor = {
        id: visitors.length + 1,
        name: values.name,
        reason: values.reason,
        personVisiting: values.personVisiting as UserRole,
        timeIn: new Date().toISOString(),
    };
    return { newVisitor };
}
