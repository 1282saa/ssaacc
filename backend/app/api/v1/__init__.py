from fastapi import APIRouter
from .auth import router as auth_router
from .onboarding import router as onboarding_router
from .users import router as users_router
from .tasks import router as tasks_router
from .policies import router as policies_router
from .youth_policies import router as youth_policies_router
from .document_progress import router as document_progress_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(onboarding_router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
api_router.include_router(policies_router, prefix="/policies", tags=["policies"])
api_router.include_router(youth_policies_router, prefix="/youth-policies", tags=["youth-policies"])
api_router.include_router(document_progress_router, prefix="/document-progress", tags=["document-progress"])

__all__ = ["api_router"]