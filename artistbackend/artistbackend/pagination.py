from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class MycustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 10
    page_query_param = "page"

    def get_paginated_data(self, data):
        data_ = {
            "next": self.page.next_page_number() if self.page.has_next() else None,
            "previous": (
                self.page.previous_page_number() if self.page.has_previous() else None
            ),
            "total_pages": self.page.paginator.num_pages,
            "count": self.page.paginator.count,
            "page_size": self.page_size,
            "results": data,
            
        }
        return data_