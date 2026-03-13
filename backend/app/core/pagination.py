from typing import Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Query parameters for pagination."""

    page: int = Field(default=1, ge=1, description="Page number (starting from 1)")
    page_size: int = Field(
        default=20, ge=1, le=100, description="Number of items per page"
    )

    @property
    def offset(self) -> int:
        """Calculate the offset for database queries based on the current page and page size."""
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Return the limit for database queries, which is the page size."""
        return self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic response model for paginated results."""

    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(
        cls, items: list[T], total: int, page: int, page_size: int
    ) -> "PaginatedResponse[T]":
        """Factory method to create a PaginatedResponse instance."""
        total_pages = (total + page_size - 1) // page_size  # Calculate total pages
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
